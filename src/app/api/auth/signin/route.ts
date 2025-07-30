import dbConnect from '@/lib/db';
import User from '@/model/User';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const signinSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const validation = signinSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Invalid input',
        success: false 
      });
    }

    const { username, password } = validation.data;

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found',
        success: false 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        success: false 
      });
    }

    // Create response with success flag
    const response = NextResponse.json({ 
      message: 'Signin successful',
      success: true,
      userId: user._id,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });

    return response;
  }catch(err){
    console.error('Signin error:', err);
    return NextResponse.json({ 
      error: 'Signin failed',
      success: false 
    });
  }
}