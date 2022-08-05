/**
 * a way to fetch the things that have been written
 */

import { useEffect, useState } from "react";

import { storageKeyPrefix } from "./constants";
import type { WrittenRecord } from "./types";

interface SuccessfulGet {
  error: Error;
  data: null;
};

interface RejectfulGet {
  error: null
  data: WrittenRecord[];
};

type GetResult = SuccessfulGet | RejectfulGet;

/**
 * @note for now, this is just backed by localStorage
 */
export const getThings = (): Promise<GetResult> => {
  const storage = localStorage.getItem(storageKeyPrefix) || "[]";
  let records: WrittenRecord[];
  
  try {
    records = JSON.parse(storage);
  } catch (error) {
    console.error("there was an issue parsing existing storage", error);
    
    return Promise.reject({
      data: null,
      error,
    });
  }

  return Promise.resolve({
    data: records,
    error: null,
  });
}

/**
 * hook to fetch the things you've written in the vein of react-query, minus the janky
 * invalidation imperative function.
 */
export const useThings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<WrittenRecord[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  /**
   * @note really can't think of a simpler way to do this after submitting new data
   */
  const [invalidationToken, setInvalidationToken] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    getThings().then((get) => {
      setIsLoading(false);
      setData(get.data);
      setError(get.error);
    });
  }, [invalidationToken, setIsLoading, setData, setError]);

  return {
    isLoading,
    error,
    data,
    invalidate: () => setInvalidationToken(t => t+1),
  };
};