import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI
  
  console.log('SPOTIFY_CLIENT_ID:', clientId, 'SPOTIFY_REDIRECT_URI:', redirectUri)

  if ( !clientId && !redirectUri) {
    return NextResponse.json(
      { error: 'Faltan variables de entorno de Spotifyclient id' },
      { status: 500 }
    )
  }
  if ( !redirectUri) {
    return NextResponse.json(
      { error: 'Faltan variables de entorno de Spotify uri' },
      { status: 500 }
    )
  }

  if ( !clientId) {
    return NextResponse.json(
      { error: 'Faltan variables de entorno de Spotifyclient id' },
      { status: 500 }
    )
  }


  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const returnedState = searchParams.get('state')
  const error = searchParams.get('error')
    
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, req.url)
    )
  }

  const cookieStore = await cookies()
  const savedState = cookieStore.get('spotify_state')?.value
  const codeVerifier = cookieStore.get('spotify_code_verifier')?.value

  if (!code || !returnedState || !savedState || returnedState !== savedState) {
    return NextResponse.json({ error: 'State inválido' }, { status: 400 })
  }

  if (!codeVerifier) {
    return NextResponse.json(
      { error: 'No se encontró code_verifier' },
      { status: 400 }
    )
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  })

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  const tokenData = await tokenRes.json()

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: 'No se pudo intercambiar el code', details: tokenData },
      { status: tokenRes.status }
    )
  }
const profileRes = await fetch('https://api.spotify.com/v1/me', {
  headers: {
    Authorization: `Bearer ${tokenData.access_token}`,
  },
  cache: 'no-store',
})

const profileData = await profileRes.json()

  if (!profileRes.ok) {
    return NextResponse.json(
      { error: 'No se pudo obtener el perfil del usuario', details: profileData },
      { status: profileRes.status }
    )
  }

  const response = NextResponse.redirect(new URL('/music', req.url))

  response.cookies.set('spotify_access_token', tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: tokenData.expires_in ?? 3600,
  })

  if (tokenData.refresh_token) {
    response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
  }

response.cookies.set('spotify_user_id', profileData.id, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
})

response.cookies.set('spotify_user_name', profileData.display_name ?? '', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
})

  response.cookies.delete('spotify_state')
  response.cookies.delete('spotify_code_verifier')

  return response
}

// import { NextRequest, NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

// export async function GET(req: NextRequest) {
//   const clientId = process.env.SPOTIFY_CLIENT_ID
//   const redirectUri = process.env.SPOTIFY_REDIRECT_URI

//   if (!clientId || !redirectUri) {
//     return NextResponse.json(
//       { error: 'Faltan variables de entorno de Spotify' },
//       { status: 500 }
//     )
//   }

//   const { searchParams } = new URL(req.url)
//   const code = searchParams.get('code')
//   const returnedState = searchParams.get('state')
//   const error = searchParams.get('error')

//   if (error) {
//     return NextResponse.json({ error }, { status: 400 })
//   }

//   const cookieStore = await cookies()
//   const savedState = cookieStore.get('spotify_state')?.value
//   const codeVerifier = cookieStore.get('spotify_code_verifier')?.value

//   console.log('returnedState:', returnedState)
//   console.log('savedState:', savedState)
//   console.log('codeVerifier:', codeVerifier)
//   console.log('all cookies:', cookieStore.getAll())

//   if (!code || !returnedState || !savedState || returnedState !== savedState) {
//     return NextResponse.json(
//       {
//         error: 'State inválido',
//         debug: {
//           codeExists: !!code,
//           returnedState,
//           savedState,
//           hasCodeVerifier: !!codeVerifier,
//         },
//       },
//       { status: 400 }
//     )
//   }

//   if (!codeVerifier) {
//     return NextResponse.json(
//       { error: 'No se encontró code_verifier' },
//       { status: 400 }
//     )
//   }

//   const body = new URLSearchParams({
//     client_id: clientId,
//     grant_type: 'authorization_code',
//     code,
//     redirect_uri: redirectUri,
//     code_verifier: codeVerifier,
//   })

//   const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body,
//     cache: 'no-store',
//   })

//   const tokenData = await tokenRes.json()

//   if (!tokenRes.ok) {
//     return NextResponse.json(
//       { error: 'No se pudo intercambiar el code', details: tokenData },
//       { status: tokenRes.status }
//     )
//   }

//   const response = NextResponse.redirect(new URL('/music', req.url))

//   response.cookies.set('spotify_access_token', tokenData.access_token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: 'lax',
//     path: '/',
//     maxAge: tokenData.expires_in ?? 3600,
//   })

//   if (tokenData.refresh_token) {
//     response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 30,
//     })
//   }

//   response.cookies.delete('spotify_state')
//   response.cookies.delete('spotify_code_verifier')

//   return response
// }

// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function GET(req: NextRequest) {
//   const clientId = process.env.SPOTIFY_CLIENT_ID;
//   const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

//   if (!clientId || !redirectUri) {
//     return NextResponse.json(
//       { error: "Faltan variables de entorno de Spotify" },
//       { status: 500 }
//     );
//   }

//   const { searchParams } = new URL(req.url);
//   const code = searchParams.get("code");
//   const returnedState = searchParams.get("state");
//   const error = searchParams.get("error");

//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

//   const cookieStore = await cookies();
//   const savedState = cookieStore.get("spotify_state")?.value;
//   const codeVerifier = cookieStore.get("spotify_code_verifier")?.value;

//   if (!code || !returnedState || !savedState || returnedState !== savedState) {
//     return NextResponse.json(
//       {
//         error: "State inválido",
//         debug: {
//           codeExists: !!code,
//           returnedState,
//           savedState,
//           hasCodeVerifier: !!codeVerifier,
//           cookies: cookieStore.getAll().map((c) => c.name),
//         },
//       },
//       { status: 400 }
//     );
//   }

//   if (!codeVerifier) {
//     return NextResponse.json(
//       { error: "No se encontró code_verifier" },
//       { status: 400 }
//     );
//   }

//   const body = new URLSearchParams({
//     client_id: clientId,
//     grant_type: "authorization_code",
//     code,
//     redirect_uri: redirectUri,
//     code_verifier: codeVerifier,
//   });

//   const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body,
//     cache: "no-store",
//   });

//   const tokenData = await tokenRes.json();

//   if (!tokenRes.ok) {
//     return NextResponse.json(
//       { error: "No se pudo intercambiar el code", details: tokenData },
//       { status: tokenRes.status }
//     );
//   }

//   const response = NextResponse.redirect(new URL("/music", req.url));

//   response.cookies.set("spotify_access_token", tokenData.access_token, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//     path: "/",
//     maxAge: tokenData.expires_in ?? 3600,
//   });

//   if (tokenData.refresh_token) {
//     response.cookies.set("spotify_refresh_token", tokenData.refresh_token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 30,
//     });
//   }

//   response.cookies.delete("spotify_state");
//   response.cookies.delete("spotify_code_verifier");

//   return response;
// }

