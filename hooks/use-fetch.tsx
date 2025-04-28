import { fail } from "assert";
import { set } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args: unknown[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response.data);
      setError(null);
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
