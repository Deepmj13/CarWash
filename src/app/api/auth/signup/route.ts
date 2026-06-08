import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"
import { rateLimit } from "@/lib/rate-limit"
import { signupSchema } from "@/lib/validations"

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown"
    if (!rateLimit(`signup:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 })
    }

    const body = await req.json()
    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { email, password, role } = parsed.data

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    })

    return NextResponse.json({ message: "User created successfully", userId: user._id }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
