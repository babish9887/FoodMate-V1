export interface UpdateOrderParams {
  _id: string;
  status: string;
  message?: string;
}

export async function getEsewaSignatureApi({ total_amount, transaction_uuid }: { total_amount: string; transaction_uuid: string }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/esewa-signature`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ total_amount, transaction_uuid })
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Failed to generate eSewa signature");
    }
  } catch (error) {
    console.error("eSewa signature API error:", error);
    throw error;
  }
}

export async function createOrderApi({ items, message, paymentMethod, esewaData }: { items: unknown, message?: string, paymentMethod?: string, esewaData?: unknown }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/createorder`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items, message, paymentMethod, esewaData })
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error creating order");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllOrdersApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/getallorders`, {
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

export async function getNotPaidOrdersApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/getnotpaidorders`, {
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

export async function getCurrentOrderApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/getcurrentorder`, {
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

export async function getTodaysOrdersApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/gettodaysorders`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function getOlderOrdersApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/getolderorders`, {
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
    throw error;
  }
}

export async function updateOrderApi({ _id, status, message }: UpdateOrderParams) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/updatecurrentorder`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, status, message: message || "" }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error updating order status");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function updateOrderItemsApi({ _id, items }: { _id: string, items: any[] }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/updateorderitems`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, items }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error updating order items");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function updateOrderToPaidApi({ _id, paymentMethod, esewaData }: { _id: string, paymentMethod: string, esewaData?: unknown }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/updatepayment`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, paymentMethod, esewaData: esewaData || null }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error updating payment status");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function cancelOrderApi({ _id, message }: { _id: string, message?: string }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/cancelorder`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id, message: message || "Cancelled by user" }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error cancelling order");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function refundApi({ _id }: { _id: string }) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/refund`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error processing refund");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}