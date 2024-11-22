import { GitHubStrategy } from 'remix-auth-github';
import { Authenticator } from 'remix-auth';
import { prisma } from './prisma.server';
import { sessionStorage } from './session.server';

const authenticatorGithub = new Authenticator(sessionStorage);

const githubStrategy = new GitHubStrategy(
  {
    clientId: process.env.GITHUB_CLIENT_ID!, 
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    redirectURI: `${process.env.BASE_URL}/auth/github/callback`, 
  },
  async ({ profile }) => {
   
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';

    const user = await prisma.user.upsert({
        where: { email },  
        update: {},        
        create: {           
          name: profile.displayName,
          email: email,     
          password: "",
        },
      });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,  
    };

    return sessionUser;  
  }
);

authenticatorGithub.use(githubStrategy, "github");

export { authenticatorGithub };