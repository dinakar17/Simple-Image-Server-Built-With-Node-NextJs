import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_IMAGE_API_URL,
});

const axiosConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
  },
};

// Create an image
export const uploadImage = (formData: FormData) =>
  API.post("/api/upload", formData, axiosConfig);

// Get all images
export const getImages = (url: string) => API.get(url);

// Delete an image
export const deleteImage = (image: string) => API.delete(`/api/${image}`, axiosConfig);
