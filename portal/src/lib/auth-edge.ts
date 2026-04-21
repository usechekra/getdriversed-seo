import NextAuth from 'next-auth'

// Lightweight config for Edge middleware — no Prisma/db imports
export const { auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
})
