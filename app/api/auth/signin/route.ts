import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/index'; // Adjust the path as needed
import bcrypt from 'bcryptjs';

const allowedOrigins = ['http://localhost:3000']; // Update this list with your allowed origins

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Respond with the user (typically you might send a token here instead)
    return NextResponse.json(user, { 
      status: 200, 
      headers: { 'Access-Control-Allow-Origin': '*' } 
    });
  } catch (error) {
    // Handle errors that occur during sign-in
    console.error('Error signing in user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
