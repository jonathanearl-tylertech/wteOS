import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { base } from "$app/paths";
import { Database } from 'bun:sqlite';
const db = new Database('./db.sqlite');

export const load: PageServerLoad = async ({ cookies }) => {
  const sid = cookies.get('session_id') as string;
  if (!sid)
    return redirect(302, '/');
  const session = db.query('SELECT * FROM sessions WHERE id = $id').get({ $id: sid }) as any;
  if (!session)
    return redirect(302, '/');
  const user = db.query('SELECT * FROM users WHERE id = $id').get({
    $id: session.user_id
  });

  return { user };
}


export const actions: Actions = {
  // update user account settings
  default: async ({ cookies, request }) => {

    const sid = cookies.get('session_id') as string;
    if (!sid)
      return redirect(302, '/');
    const session = db.query('SELECT * FROM sessions WHERE id = $id').get({ $id: sid }) as any;
    console.log({session})
    if (!session)
      return redirect(302, '/');

    let user = db.query('SELECT * FROM users WHERE id=$id').get({$id: session.user_id}) as any
    console.log({user})
    if (!user)
      return redirect(302, `${base}/`);

    const formData = await request.formData();
    const username = formData.get('username');
    if (!username || !username.toString())
      error(400, 'Username is required');
    console.log({username})
    console.log({user})
    const existingUser = db.query('SELECT id, username FROM users WHERE username = $username').get({
      $username: username.toString(),
    });

    console.log({existingUser})
    if (existingUser)
      error(400, 'Username is already taken');

    user.username = username.toString();
    db.run('UPDATE users SET username=? WHERE id=?', [username.toString(), user.id]);
    user = db.query('SELECT * FROM users WHERE id=$id').get({$id: session.user_id}) as any
    console.log({user})
    return {
      user
    };
  }
}
