import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllUnits } from "@/services/profile.service";

export const useInfiniteUnits = (
  pageSize: number = 20,
  searchTerm?: string
) => {
  return useInfiniteQuery({
    queryKey: ["units-infinite", pageSize, searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      getAllUnits(pageParam, pageSize, searchTerm),

    // Determine next page
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.totalPages) return undefined;

      const next = pages.length + 1;
      return next <= lastPage.totalPages ? next : undefined;
    },

    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
