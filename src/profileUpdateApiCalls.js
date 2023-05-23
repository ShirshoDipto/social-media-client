import { v4 as uuidv4 } from "uuid";
const serverRoot = process.env.REACT_APP_SERVERROOT;

export async function addPic(pic, userId, token) {
  try {
    const formData = new FormData();
    formData.append("imageName", uuidv4());
    formData.append("image", pic);

    const res = await fetch(`${serverRoot}/api/users/${userId}/pic`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.imageUrl;
  } catch (error) {
    throw error;
  }
}

export async function deletePic(imageUrl, userId, token) {
  try {
    const res = await fetch(`${serverRoot}/api/users/${userId}/pic`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl,
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return "";
  } catch (error) {
    throw error;
  }
}

export async function replacePic(existingUrl, pic, userId, token) {
  try {
    const formData = new FormData();
    formData.append("imageName", uuidv4());
    formData.append("image", pic);
    formData.append("existingImageUrl", existingUrl);

    const res = await fetch(`${serverRoot}/api/users/${userId}/pic`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.imageUrl;
  } catch (error) {
    throw error;
  }
}

export async function updateBio(userId, data, token) {
  try {
    const res = await fetch(`${serverRoot}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.user;
  } catch (error) {
    throw error;
  }
}
