import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function will run for every request that matches its config.
export function middleware(request: NextRequest) {
  // If the incoming request is a preflight OPTIONS request, we handle it here.
  if (request.method === 'OPTIONS') {
    // Create a new response with a 200 OK status.
    const response = new NextResponse(null, { status: 200 });

    // Add the crucial CORS headers to this response.
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Send the response immediately.
    return response;
  }

  // For all other requests (GET, POST, etc.), just let them pass through.
  return NextResponse.next();
}

// This configures the middleware to only run on routes that start with '/api/'.
export const config = {
  matcher: '/api/:path*',
};