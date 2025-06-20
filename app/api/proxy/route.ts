import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Proxy route for preview and customization purposes
export async function GET(request: NextRequest) {
  try {
    // Get the target URL from the query parameters
    const targetUrl = request.nextUrl.searchParams.get('url');
    if (!targetUrl) {
      return new NextResponse('Missing target URL', { status: 400 });
    }

    // Get the API key from the query parameters
    const apiKey = request.nextUrl.searchParams.get('apiKey');
    if (!apiKey) {
      return new NextResponse('Missing API key', { status: 400 });
    }

    // Fetch the target website
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return new NextResponse(`Target website returned error: ${response.status}`, { status: response.status });
    }

    const html = await response.text();

    // Inject our search bar script
    const searchBarScript = `
      <script src="https://nextjs-nlps-back.vercel.app/embed.js?apiKey=${apiKey}"></script>
    `;

    // Insert the script before the closing body tag
    const modifiedHtml = html.replace('</body>', `${searchBarScript}</body>`);

    // Return the modified HTML with CORS headers
    return new NextResponse(modifiedHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 