import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

const LoaderContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const startLoading = () => setIsLoading(true);
  const endLoading = () => setIsLoading(false);

  const value = { isLoading, startLoading, endLoading };
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>;
};

const useLoaderContext = () => {
  return useContext(LoaderContext);
};

export { useLoaderContext, LoaderContextProvider };
