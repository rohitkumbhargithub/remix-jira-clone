// app/routes/auth/github.tsx
import { LoaderFunction } from '@remix-run/node';
import { authenticatorGithub } from '~/utils/github-strategy.server';

export let loader: LoaderFunction = ({ request }) => {
  return authenticatorGithub.authenticate('github', request); // This triggers the GitHub OAuth flow
};
