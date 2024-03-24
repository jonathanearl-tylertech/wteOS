import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';
import { randomUUID } from 'node:crypto';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
	const { token_endpoint, userinfo_endpoint, issuer } = await res.json();

	const code = url.searchParams.get('code');
	if (!code) error(400, 'searchParam [code] missing');

	const endpoint = new URL(token_endpoint);
	endpoint.searchParams.append('code', code);
	endpoint.searchParams.append('client_id', env.google_client_id);
	endpoint.searchParams.append('client_secret', env.google_client_secret);
	endpoint.searchParams.append('redirect_uri', env.google_redirect_url);
	endpoint.searchParams.append('grant_type', 'authorization_code');
	let response = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});
	if (response.status != 200) error(400, response.statusText);

	const { access_token, id_token } = await response.json();
	const headers = new Headers({});
	headers.append('Authorization', `Bearer ${access_token}`);
	response = await fetch(userinfo_endpoint, { headers });
	const userinfo = await response.json();
	console.log({ userinfo });

	response = await fetch(userinfo.picture);
	const buf = await response.arrayBuffer();
	const picture = Buffer.from(buf);

	const db = new Database('./db.sqlite');
	let user = db
		.query('SELECT * FROM users WHERE email = $email')
		.get({ $email: userinfo.email }) as any;
	console.log({ user });

	if (!user) {
		db.prepare(
			`
      INSERT INTO users (sub, name, given_name, family_name, picture, email, email_verified, local) 
      VALUES ($sub, $name, $given_name, $family_name, $picture, $email, $email_verified, $local)
    `
		).run({
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

	user = db
		.query('SELECT * FROM users WHERE email = $email')
		.get({ $email: userinfo.email }) as any;
	console.log({ user });

	const session_id = randomUUID();
	db.prepare(
		`
    INSERT INTO sessions (id, user_id) VALUES ($id, $user_id)
  `
	).values({
		$id: session_id,
		$user_id: user.id
	});

	cookies.set('session_id', session_id, { path: '/', httpOnly: true });
	return redirect(302, '/');
};
