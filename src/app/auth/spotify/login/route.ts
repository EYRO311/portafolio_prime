import { NextResponse } from "next/server";
import {
  createCodeChallenge,
  generateRandomString,
} from "@/src/app/components/lib/spotify-pkce";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Faltan variables de entorno de Spotify' },
      { status: 500 }
    );
  }

  const state = generateRandomString(16);
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await createCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: [
      "user-top-read",
      "user-read-private",
      "user-read-email",
      "user-read-recently-played",
      "user-read-playback-state",
      "user-read-currently-playing",
      "playlist-read-private",
      "playlist-read-collaborative",
    ].join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    show_dialog: "true",
  });

  const spotifyUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  // Devuelve 200 con HTML redirect para que Set-Cookie funcione en Vercel.
  // Los redirects 302 con cookies son filtrados por el edge de Vercel/Next.js.
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${spotifyUrl}"></head><body></body></html>`;

  const response = new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });

  response.cookies.delete("spotify_access_token");
  response.cookies.delete("spotify_refresh_token");
  response.cookies.delete("spotify_user_id");
  response.cookies.delete("spotify_user_name");

  response.cookies.set("spotify_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  response.cookies.set("spotify_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
