import CryptoJS from "crypto-js";

const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_RSA_SECRET_KEY).toString();
};

export async function createFeedbackApi(feedbackData: any) {
  try {
    const encryptedData = encryptData(feedbackData);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/createfeedback`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: encryptedData })
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error storing data");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMyFeedbacksApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/getmyfeedbacks`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error fetching data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function getAllFeedbacksApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/getallfeedbacks`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error fetching data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function replyToFeedbackApi({ _id, reply }: any) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/replytofeedback/${_id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, reply }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error updating Category");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}