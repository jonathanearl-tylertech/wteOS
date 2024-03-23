import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
  const discovery = await res.json();
  console.log({ discovery })
  const { authorization_endpoint } = await discovery;

  const endpoint = new URL(authorization_endpoint);
  endpoint.searchParams.append('client_id', env.google_client_id);
  endpoint.searchParams.append('scope', 'email openid profile');
  endpoint.searchParams.append('redirect_uri', env.google_redirect_url);
  endpoint.searchParams.append('response_type', 'code');
  console.log(endpoint.toString())

  redirect(302, endpoint.toString());
};
