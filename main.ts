const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";

const CSRF_TOKEN_RE = /XSRF-TOKEN=([^;]+)/;

/** 获取 xsrf-token */
async function getXsrfToken(): Promise<string> {
  const response = await fetch("https://esoserverstatus.net", {
    headers: {
      Accept: "text/html",
      "user-agent": DEFAULT_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch CSRF token: ${response.status} ${response.statusText}`,
    );
  }

  const rawCookieHeader = response.headers.get("set-cookie") || "";
  return rawCookieHeader.match(CSRF_TOKEN_RE)?.[1] || "";
}

async function getServerStatus(csrfToken: string) {
  const headers = new Headers({
    "user-agent": DEFAULT_USER_AGENT,
    "x-requested-with": "XMLHttpRequest",
    "x-xsrf-token": csrfToken,
  });

  return await fetch("https://esoserverstatus.net/api/refresh", { headers });
}

let csrfTokenValue = await getXsrfToken();

Deno.serve(async () => {
  try {
    let response = await getServerStatus(csrfTokenValue);
    if (response.status === 401) {
      csrfTokenValue = await getXsrfToken();
      response = await getServerStatus(csrfTokenValue);
    }
    return response;
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
