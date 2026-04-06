import { useEffect, useState } from "react";
import axios from "axios";
import { categoriesEndpoint } from "../utils/api";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(categoriesEndpoint)
      .then((response) => {
        setCategories(response.data.result ?? []);
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { categories, isLoading };
}
