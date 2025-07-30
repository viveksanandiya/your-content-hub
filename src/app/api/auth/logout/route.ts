import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Logout successful',
      success: true 
    });

    response.cookies.delete('userId');

    return response;
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ 
      error: 'Logout failed',
      success: false 
    });
  }
}

