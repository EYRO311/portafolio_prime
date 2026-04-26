export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  const data = await safeJson(res);
  if (!res.ok) throw new Error((data as any)?.message || "API error");
  return data as T;
}