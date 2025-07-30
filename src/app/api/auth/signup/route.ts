import dbConnect from '@/lib/db';
import User from '@/model/User';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const signupSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const validation = signupSchema.safeParse(body);
    
    if(!validation.success){
      return NextResponse.json({ 
        error: 'Invalid input',
        success: false 
      });
    }

    const { username, email, password} = validation.data;

    const userExisting = await User.findOne({username});
    if (userExisting) {
      return NextResponse.json({
        error: 'Username already taken',
        success: false 
      });
    }

    const emailExisting = await User.findOne({ email });
    if (emailExisting) {
      return NextResponse.json({
        error: 'Email already registered',
        success: false 
      }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const res = NextResponse.json({ 
      message: 'Signup successful',
      success: true,
      userId: newUser._id,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

    return res;
  
  }catch(err) {
    console.error('Signup error:', err);
    return NextResponse.json({ 
      error: 'Signup failed',
      success: false 
    });
  }
}