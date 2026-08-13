interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role?: string;
}

export default async function CheckLogin(): Promise<User | null> {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.success && data.user) {
      return data.user as User;
    }
    return null;
  } catch (error) {
    console.error("CheckLogin error:", error);
    return null;
  }
}
