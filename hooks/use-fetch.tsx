import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb: Function) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args: unknown[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      if (response.success) {
        setData(response); // Store the data if success is true
      } else {
        setError(response); // Handle the error if success is false
        toast.error(response.error || "Something went wrong");
      }
    } catch (error: any) {
      console.log(error);
      setError(error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
