"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Camera, Search, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { processImageSearch } from "@/actions/home";

const HomeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [searchImage, setSearchImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const {
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch);

  const onDrop = (acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Falied to read the image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };
  const handleImageSeach = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image");
      return;
    }

    // add ai logic after this
    await processImageFn(searchImage);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".png", ".jpg"],
      },
      maxFiles: 1,
    });

  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError || "Unknown Error")
      );
    }
  }, [processError]);
  useEffect(() => {
    if (processResult?.success) {
      const params = new URLSearchParams();

      if (processResult.make) params.set("make", processResult.make);

      if (processResult.bodyType)
        params.set("bodyType", processResult.bodyType);

      if (processResult.color) params.set("color", processResult.color);

      router.push(`/cars?${params.toString()}`);
    }
  }, [processResult]);

  return (
    <div>
      <form onSubmit={handleTextSearch}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5" />
          <Input
            type="text"
            placeholder="Enter make, model, or use our AI Image Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-12 py-6 w-full rounded-full border-gray-300 bg-white/95 backdrop-blur-sm"
          />

          {/* Image Search Button */}
          <div className="absolute right-[100px]">
            <Camera
              size={35}
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className="cursor-pointer rounded-xl p-1.5"
              style={{
                background: isImageSearchActive ? "black" : "",
                color: isImageSearchActive ? "white" : "",
              }}
            />
          </div>

          <Button type="submit" className="absolute right-2 rounded-full bg-red-500">
            Search
          </Button>
        </div>
      </form>
      {isImageSearchActive && (
        <div className="mt-4">
          <form onSubmit={handleImageSeach}>
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center">
              {imagePreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Car Preview"
                    className="h-40 object-contain mb-4"
                  />
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setImagePreview(null);
                      setSearchImage(null);
                      toast.info("Image removed");
                    }}
                  >
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
          {imagePreview && (
            <Button
              type="submit"
              className="w-full"
              onClick={handleImageSeach}
              disabled={isProcessing}
            >
              {isUploading
                ? "Uploading..."
                : isProcessing
                ? "Analyzing Image..."
                : "Search with this image"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
