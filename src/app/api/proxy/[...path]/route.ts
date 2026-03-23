import { NextRequest, NextResponse } from "next/server";

function getBackendOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  const fallback = "http://localhost:5000";
  if (!raw) return fallback;
  return raw.replace(/\/+$/, "").replace(/\/api$/i, "") || fallback;
}

/**
 * Proxy API requests to the backend to avoid CORS when the backend doesn't send proper CORS headers.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, "DELETE");
}

async function proxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) {
  try {
    const { path } = await params;
    const pathStr = path?.length
      ? path
          .filter((p) => p && !p.includes("..") && !p.startsWith("."))
          .join("/")
      : "";
    if (!pathStr) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    const backendOrigin = getBackendOrigin();
    const url = `${backendOrigin}/api/${pathStr}${request.nextUrl.search}`;

    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (
        key.toLowerCase() !== "host" &&
        key.toLowerCase() !== "connection" &&
        key.toLowerCase() !== "content-length"
      ) {
        headers.set(key, value);
      }
    });

    const body = method !== "GET" && method !== "HEAD" ? await request.text() : undefined;

    const res = await fetch(url, {
      method,
      headers,
      body: body || undefined,
    });

    const data = await res.text();
    const responseHeaders = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "transfer-encoding") {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(data, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[API Proxy] Error:", err);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 502 }
    );
  }
}
