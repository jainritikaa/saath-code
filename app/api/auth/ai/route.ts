import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Ensure the API key is set
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt } = body;

    // Log the received prompt
    console.log('Received prompt:', prompt);

    // Modify the prompt to include the instruction for generating README markdown
    const modifiedPrompt = `Here is the code:\n\n${prompt}\n\nGive README markdown for the code.`;

    // Log the modified prompt
    console.log('Modified prompt:', modifiedPrompt);

    // Make the request to the Gemini API
    const result = await model.generateContent(modifiedPrompt);

    // Log the result
    console.log('Result from Gemini API:', result);

    const response = await result.response;
    const text = await response.text();

    // Log the generated README content
    console.log('Generated README:', text);

    // Send the generated README content back to the client
    return NextResponse.json(
      { readme: text },
      {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (error) {
    console.error('Error generating README:', error);
    return NextResponse.json(
      { message: 'Failed to generate README' },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
}
