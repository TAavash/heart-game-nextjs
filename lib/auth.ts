import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();

        interface IUser {
          _id: string;
          email: string;
          username: string;
          password: string;
        }

        const user = await User.findOne({
          email: credentials.email,
        }).lean<IUser | null>();

        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" as const },
  secret: process.env.AUTH_SECRET,
};
