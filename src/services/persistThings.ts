/**
 * @fileoverview a way to save the things that get written
 */

import { storageKeyPrefix } from "./constants";
import { getThings } from "./getThings";

interface SaveResult {
  success: boolean;
  error: Error | null;
}

/**
 * @note for now, this is just backed by localstorage
 */
export const persistThings = async (things: [string, string, string]): Promise<SaveResult> => {
  let result = await getThings();

  if (result.error !== null) {
    return Promise.reject({
      error: result.error,
      success: false,
    });
  }

  result.data.push({
    things,
    date: (new Date()).toISOString().split("T")[0],
  });

  try {
    localStorage.setItem(storageKeyPrefix, JSON.stringify(result.data));
  } catch (error) {
    console.error("there was an issue setting the records", error);
  
    return Promise.reject({
      success: false,
      error,
    })
  }

  return Promise.resolve({
    success: true,
    error: null,
  });
}
