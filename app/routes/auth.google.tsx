import { LoaderFunction } from '@remix-run/node';
import { authenticatorGoogle } from '~/utils/google-strategy.server';

export let loader: LoaderFunction = ({ request }) => {
  return authenticatorGoogle.authenticate('google', request);
};