type Env = {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_GITHUB_LOGIN: string;
  ALLOWED_ORIGIN: string;
};

const stateCookie = "decap_oauth_state";

function noStore(headers?: HeadersInit) {
  return {
    ...headers,
    "Cache-Control": "no-store",
  };
}

function cors(origin: string) {
  return noStore({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  });
}

function randomState() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function getCookie(request: Request, name: string) {
  const cookie = request.headers.get("Cookie") ?? "";
  return cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function html(message: string, origin: string, status = 200) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><script>${message}</script>`,
    {
      status,
      headers: noStore({
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy":
          "default-src 'none'; script-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; style-src 'none'; base-uri 'none'; frame-ancestors 'none'",
        "Access-Control-Allow-Origin": origin,
      }),
    },
  );
}

async function auth(request: Request, env: Env) {
  const origin = request.headers.get("Origin") ?? env.ALLOWED_ORIGIN;
  if (origin !== env.ALLOWED_ORIGIN)
    return new Response("Forbidden origin", {
      status: 403,
      headers: noStore(),
    });

  const state = randomState();
  const redirectUri = new URL("/callback", request.url).toString();
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "public_repo",
    state,
  });
  return new Response(null, {
    status: 302,
    headers: noStore({
      Location: `https://github.com/login/oauth/authorize?${params}`,
      "Set-Cookie": `${stateCookie}=${state}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
    }),
  });
}

async function callback(request: Request, env: Env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = getCookie(request, stateCookie);
  const clearCookie = `${stateCookie}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;

  if (!code || !state || !expectedState || state !== expectedState) {
    return new Response("Invalid OAuth state", {
      status: 400,
      headers: noStore({ "Set-Cookie": clearCookie }),
    });
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    },
  );
  const tokenJson = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
  };
  if (!tokenResponse.ok || !tokenJson.access_token) {
    return new Response("OAuth token exchange failed", {
      status: 401,
      headers: noStore({ "Set-Cookie": clearCookie }),
    });
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "joestarzhx-decap-oauth-worker",
    },
  });
  const user = (await userResponse.json()) as { login?: string };
  if (!userResponse.ok || user.login !== env.ALLOWED_GITHUB_LOGIN) {
    return new Response("Forbidden GitHub user", {
      status: 403,
      headers: noStore({ "Set-Cookie": clearCookie }),
    });
  }

  const payload = {
    token: tokenJson.access_token,
    provider: "github",
  };
  return html(
    `window.opener && window.opener.postMessage('authorization:github:success:${JSON.stringify(payload)}', ${JSON.stringify(env.ALLOWED_ORIGIN)}); window.close();`,
    env.ALLOWED_ORIGIN,
  );
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    if (request.method === "OPTIONS" && origin === env.ALLOWED_ORIGIN) {
      return new Response(null, { headers: cors(env.ALLOWED_ORIGIN) });
    }
    if (url.pathname === "/auth") return auth(request, env);
    if (url.pathname === "/callback") return callback(request, env);
    return new Response("Not found", { status: 404, headers: noStore() });
  },
};
