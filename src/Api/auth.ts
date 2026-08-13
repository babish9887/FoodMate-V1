export async function signUpApi({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error storing data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function signUpGoogleApi({
  idToken,
}: {
  idToken: string;
}) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/googlesignup`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Google sign-in failed");
    }
  } catch (error) {
    console.error("Error sending Google token to server:", error);
    throw error;
  }
}


export async function loginApi({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error storing data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function adminLoginApi({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/adminlogin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error storing data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}


export async function passwordResetEmailApi({
  email,
}: {
  email: string;
}) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/sendpasswordresetlink`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error storing data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}


export async function resetPasswordApi({
  id,
  forgotPasswordToken,
  password
}: {
  id: string | null;
  forgotPasswordToken: string | null;
  password:string
}) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resetpassword`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, forgotPasswordToken, password }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error storing data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}
