import { DirListing } from 'lib/fileLister';
import { useState } from 'react';

const useChartList = () => {
	const [isBusy, setIsBusy] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [files, setFiles] = useState<DirListing[] | null>(null);

	const load = async (dir?: string) => {
		setIsBusy(true);

		try {
			const res = await fetch(`/api/charts${dir ? `?dir=${dir}` : ''}`);
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
