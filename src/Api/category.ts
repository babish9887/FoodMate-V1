import convertBase64 from "../Utils/ConvertBase64";

export async function getCategoriesApi() {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food/category`, {
      method: "GET",
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

export async function AddCategoryApi({
  name,
  icon
}: {
  name: string | null;
  icon: any
}) {
  const iconBase64 = await convertBase64(icon);

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food/category/addcategory`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, icon: iconBase64 }),
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

export async function DeleteCategoryApi(id: any) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food/category/deletecategory/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error deleting data");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function UpdateCategoryApi({
  _id,
  name,
  icon
}: {
  _id: string,
  name: string | null;
  icon: any
}) {
  let iconBase64 = undefined;
  if (icon instanceof File || icon instanceof FileList)
    iconBase64 = await convertBase64(icon);
  else {
    iconBase64 = icon;
  }
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food/category/updatecategory/${_id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, icon: iconBase64 }),
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