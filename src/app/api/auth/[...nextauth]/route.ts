import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { rateLimit } from "@/lib/rate-limit"

export const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        if (!rateLimit(`login:${credentials.email}`, 10, 900_000)) return null

        await connectDB()
        const user = await User.findOne({ email: credentials.email })

        if (!user || user.isBlocked) return null

        const isValid = await bcrypt.compare(credentials.password, user.password || "")
        if (!isValid) return null

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.sub
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
