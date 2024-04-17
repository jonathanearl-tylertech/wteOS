import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';

export const load: PageServerLoad = async ({ url, cookies }) => {
  let res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
  const { token_endpoint, userinfo_endpoint, issuer } = await res.json();

  const code = url.searchParams.get('code');
  if (!code) error(400, 'searchParam [code] missing');

  const sid = cookies.get('sid') as string;
  const db = new Database('./db.sqlite');
  const session = db
    .query('SELECT * FROM sessions WHERE id = $sid')
    .get({ $sid: sid }) as any;

  if (!session)
    redirect(302, '/');

  const endpoint = new URL(token_endpoint);
  endpoint.searchParams.append('code', code);
  endpoint.searchParams.append('client_id', env.google_client_id as string);
  endpoint.searchParams.append('client_secret', env.google_client_secret as string);
  endpoint.searchParams.append('redirect_uri', env.google_redirect_url as string);
  endpoint.searchParams.append('grant_type', 'authorization_code');
  endpoint.searchParams.append('code_verifier', session.code_verifier);

  res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (res.status != 200) {
    console.error(await res.text())
    error(400, res.statusText);
  }

  const data = await res.json();
  const { access_token, id_token } = data;
  const parts = id_token.split('.')
  console.log(Buffer.from(parts[1], 'base64url').toString())

  const headers = new Headers({});
  headers.append('Authorization', `Bearer ${access_token}`);
  res = await fetch(userinfo_endpoint, { headers });
  const userinfo = await res.json();

  const allowedUsers = env.allowed_emails ? env.allowed_emails.split(' ') : [];
  if (!allowedUsers.includes(userinfo.email as string))
    error(403, 'Not authorized.')

  res = await fetch(userinfo.picture);
  const buf = await res.arrayBuffer();
  const picture = Buffer.from(buf);

  let user = db
    .query('SELECT * FROM users WHERE email = $email')
    .get({ $email: userinfo.email }) as any;

  if (!user) {
    db.prepare(`
      INSERT INTO users (sub, name, given_name, family_name, picture, email, email_verified, local) 
      VALUES ($sub, $name, $given_name, $family_name, $picture, $email, $email_verified, $local)
    `).run({
      $sub: userinfo.sub,
      $name: userinfo.name,
      $given_name: userinfo.given_name,
      $family_name: userinfo.family_name,
      $email: userinfo.email,
      $email_verified: userinfo.email_verified,
      $local: userinfo.local,
      $picture: picture.toString('base64')
    });
  }

  user = user ?? db
    .query('SELECT * FROM users WHERE email = $email')
    .get({ $email: userinfo.email }) as any;

  db.prepare('UPDATE sessions SET user_id = $user_id WHERE id == $sid')
    .values({ $sid: sid, $user_id: user.id });

  return redirect(302, '/');
};
