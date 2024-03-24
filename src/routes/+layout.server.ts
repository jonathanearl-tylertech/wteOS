import type { LayoutServerLoad } from './$types';
import { Database } from 'bun:sqlite';

export const load: LayoutServerLoad = ({ cookies }) => {
	const session_id = cookies.get('session_id') as string;
	if (!session_id) return {};
	const db = new Database('./db.sqlite');
	const session = db.query('SELECT * FROM sessions WHERE id = $id').get({ $id: session_id }) as any;
	if (!session) return {};
	const user = db
		.query('SELECT id, username, email, name, picture FROM users WHERE id = $user_id')
		.get({ $user_id: session.user_id }) as any;
	if (!user) return {};
	return { user };
};
