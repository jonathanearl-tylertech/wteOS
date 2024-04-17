import type { LayoutServerLoad } from './$types';
import { Database } from 'bun:sqlite';

export const load: LayoutServerLoad = ({ cookies }) => {
  const sid = cookies.get('sid') as string;

  const db = new Database('./db.sqlite');
  const session = db
    .query('SELECT * FROM sessions WHERE id = $id')
    .get({ $id: sid }) as any;

  if (!session) return {};

  const user = db
    .query('SELECT id, username, email, name, picture FROM users WHERE id = $id')
    .get({ $id: session.user_id }) as any;

  if (!user) return {};

  return { user };
};
