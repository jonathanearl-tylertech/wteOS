import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Database } from 'bun:sqlite';
import Crypto from 'node:crypto';

export const load: PageServerLoad = async ({ cookies }) => {
  const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
  const discovery = await res.json();
  const { authorization_endpoint } = await discovery;

  const code_verifier = Buffer.from(crypto.getRandomValues(new Uint8Array(64))).toString('hex');

  const sid = Crypto.randomUUID();
  cookies.set('sid', sid, { path: '/', httpOnly: true })

  const db = new Database('./db.sqlite');
  db.prepare('INSERT INTO sessions (id, code_verifier) VALUES ($sid, $code_verifier)')
    .values({ $sid: sid, $code_verifier: code_verifier })

  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(code_verifier);
  const buf = hasher.digest();
  const code_challenge = Buffer.from(buf.buffer).toString('base64url');

  const endpoint = new URL(authorization_endpoint);
  endpoint.searchParams.append('client_id', env.google_client_id);
  endpoint.searchParams.append('scope', 'email openid profile');
  endpoint.searchParams.append('redirect_uri', env.google_redirect_url);
  endpoint.searchParams.append('response_type', 'code');
  endpoint.searchParams.append('code_challenge', code_challenge);
  endpoint.searchParams.append('code_challenge_method', 'S256');

  redirect(302, endpoint.toString());
};
