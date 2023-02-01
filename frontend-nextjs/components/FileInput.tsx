import React from "react";
import Image from "next/legacy/image";

type FileInputProps = {
  image: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileInput = ({ image, handleChange }: FileInputProps) => {
  return (
    <label
      htmlFor="dropzone-file"
      className="relative flex flex-col items-center justify-center md:w-1/2 w-full h-72 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      {image ? (
        <Image
          src={image}
          alt="image"
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      ) : (
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            aria-hidden="true"
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
      )}
      <input
        id="dropzone-file"
        type="file"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  );
};

export default FileInput;
