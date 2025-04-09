"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Camera, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [searchImage, setSearchImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
    const onDrop = (acceptedFiles) => {
      // Do something with the files
      const file = acceptedFiles[0];
  
      if(file) {
        if(file.size > 5 *1024 *1024) {
          toast.error("File size exceeds 5MB")
          return;
        }
        setIsUploading(true)
        setSearchImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
          setIsUploading(false)
          toast.success("Image uploaded successfully")
        }
        reader.onerror = () => {
          setIsUploading(false);
          toast.error("Falied to read the image")
        }
        reader.readAsDataURL(file)
      }
    };

    const router = useRouter()
  
    const handleTextSubmit = (e) => {
      e.preventDefault()
      if(!searchTerm.trim()){
        toast.error("Please enter a search term")
        return
      }
      router.push(`/cars?search=${encodeURIComponent(searchTerm)}`)
    };
    const handleImageSeach = (e) => {
      e.preventDefault()
      if(!searchImage){
        toast.error("Please upload an image")
        return
      }

      // add ai logic after this
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".png", ".jpg"],
      },
      maxFiles: 1,
    });

  return (
    <div>
      <form>
        <div className="relative flex items-center">
          <Input className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm" />
        </div>
        <div className="absolute right-[100px] ">
          <Camera
            className=" cursor-pointer rounded-xl p-1.5"
            onClick={() => setIsImageSearchActive(!isImageSearchActive)}
            style={{
              background: isImageSearchActive ? "black" : "",
              color: isImageSearchActive ? "white" : "",
            }}
          />
        </div>
        <Button type="submit" className="absolute right-2 rounded-full">
          Search
        </Button>
      </form>
      {isImageSearchActive && (
        <div className="mt-4">
          <form onSubmit={handleImageSeach}>
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img src={imagePreview} alt="Car Preview" className="h-40 object-contain mb-4" />
                  <Button variant={"outline"} onClick={() => {
                    setImagePreview(null);
                    setSearchImage(null);
                    toast.info("Image removed")
                  }}>
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500 mb-2">
                      {isDragActive && !isDragReject
                        ? "Drop the files here ..."
                        : "Drag 'n' drop some files here, or click to select files"}
                    </p>
                    {isDragReject && (
                      <p className="text-red-500 mb-2">Unsupported file type</p>
                    )}
                    <p className="text-gray-400 text-sm">
                      Support :JPG,PNG (max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </form>
          {
            imagePreview && <Button type="submit" className="w-full" onClick={handleImageSeach}>
              {isUploading ? "Uploading..." : "Search with this image"}
            </Button>
          }
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
