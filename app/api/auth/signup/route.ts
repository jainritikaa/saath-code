import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/index'; // Adjust the path as needed
import bcrypt from 'bcryptjs';

const allowedOrigins = ['http://localhost:3000']; // Update this list with your allowed origins

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { username, email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Respond with the newly created user
    return NextResponse.json(user, { 
      status: 201, 
      headers: { 'Access-Control-Allow-Origin': '*' } 
    });
  } catch (error) {
    // Handle errors that occur during user creation
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
