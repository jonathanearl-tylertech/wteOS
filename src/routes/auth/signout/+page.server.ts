import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';

export const load: PageServerLoad = ({ cookies }) => {
  const sid = cookies.get('sid') as string;
  if (!sid)
    return {};

  cookies.delete('sid', { path: '/' });
  const db = new Database('db.sqlite');
  db.prepare('DELETE FROM sessions WHERE id == $sid')
    .values({ $sid: sid })

  return {};
};
