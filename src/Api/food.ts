import convertBase64 from "../Utils/ConvertBase64";
import { Food } from "../Utils/types";

export async function addFoodApi(food: Food) {
  const image = await convertBase64(food.image);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/food/createfood`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...food, image: image }),
      }
    );

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

export async function getFoodsApi() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/food/getfoods`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

export async function getAdminFoodsApi() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/food/adminfoods`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

export async function updateFoodApi({
  _id,
  name,
  description,
  veg,
  category,
  sizes,
  available,
  image,
  isFeatured,
}: any) {
  let imageBase64 = undefined;
  if (image instanceof File || image instanceof FileList)
    imageBase64 = await convertBase64(image);
  else {
    imageBase64 = image;
  }
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/food/updatefood/${_id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: imageBase64,
          veg,
          description,
          category,
          sizes,
          available,
          isFeatured,
        }),
      }
    );

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error updating Food");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function updateFoodAvailabilityApi({
  _id,
  available,
}: {
  _id: string;
  available: boolean;
}) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/food/updatefoodavailability/${_id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available }),
      }
    );

    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || "Error updating Food Availability");
    }
  } catch (error) {
    console.error("Error sending data to the server:", error);
    throw error;
  }
}

export async function deleteFoodApi(id: any) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/food/deletefood/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

export async function getRecommendedFoodsApi() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/food/getrecommendedfoods`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
