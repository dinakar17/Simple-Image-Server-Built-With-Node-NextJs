import { useEffect, useState } from "react";
import axios from "axios";
import FileInput from "@/components/FileInput";
import toast, { Toaster } from "react-hot-toast";
import dayjs from "dayjs";
import ImagesGrid from "@/components/ImagesGrid";
import useSWR from "swr";
import { getImages, uploadImage } from "@/api";
const fetcher = (url: string) => getImages(url).then((res) => res.data);

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null | Blob>(null);

  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_IMAGE_API_URL}/api/getImages`,
    fetcher
  );

  console.log(`${process.env.NEXT_PUBLIC_IMAGE_API_URL}/api/getImages`)

  // Event handler that is triggered when the user selects an image
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file) {
      const modifiedFileName = `${dayjs().format("DD-MM-YYYY-HH-mm-ss")}-${
        file.name
      }`;
      const modifiedFile = new File([file], modifiedFileName, {
        type: file.type,
      });

      setPhoto(modifiedFile);
    }
  };

  // This `useEffect()` gets triggered whenever the `photo` state changes
  useEffect(() => {
    if (!photo) {
      setPhoto(null);
      return;
    }

    // URL.createObjectURL() creates a DOMString containing a URL representing the object given in the parameter
    // In simple terms, it creates a blob URL from the file which is quite long and unique to temporarily display the image
    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

// This function is triggered when the user clicks the upload button
  const handleUpload = async () => {
    if (!photo) {
      toast.error("Please select an image to upload");
      return;
    }
    const formData = new FormData();
    formData.append("image-file", photo as File);
    console.log(formData); // formData will always show as an empty object in the console
    try {
      const response = uploadImage(formData);
      toast.promise(response, {
        loading: "Uploading...",
        success: "Uploaded successfully",
        error: "Failed to upload",
      });
      await response;
      // This will trigger a getAllImages() call to the server since when we upload an image, we want to display it on the page
      mutate();
      setPreview(null);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
      <div className="flex flex-col space-y-12 items-center justify-center py-2 mx-auto">
        <FileInput image={preview} handleChange={handleChange} />
        <button
          onClick={handleUpload}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        >
          Upload to Server
        </button>
        <ImagesGrid
          data={data}
          isLoading={isLoading}
          error={error}
          mutate={mutate}
        />
      </div>
    </>
  );
}
