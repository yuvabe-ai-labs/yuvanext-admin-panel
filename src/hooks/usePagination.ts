import { useState } from "react";

export const usePagination = (
    initialPage: number = 1,
    initialLimit: number = 9,
) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const resetPage = () => setPage(1);

    return {
        page,
        limit,
        setPage,
        setLimit,
        resetPage,
    };
};
