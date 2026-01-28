import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    '/properties/add',
    '/profile',
    '/properties/saved',
    '/properties/messages',
  ],
};
