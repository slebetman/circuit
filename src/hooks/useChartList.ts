import { useEffect, useState } from "react";

const useChartList = () => {
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [files, setFiles] = useState<string[] | null>(null);

  const load = async () => {
    setIsBusy(true);

    try {
      const res = await fetch("/api/charts");
      const list = await res.json();

      setFiles(list.charts);
    } catch (err) {
      setError(err as Error);
    }

    setIsBusy(false);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isBusy,
    files,
    error,
    load,
    clearError,
  };
};

export default useChartList;
