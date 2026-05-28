"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  submitRating,
  getProductRating,
} from "../services/rating-service";

export function useProductRating(productId: string) {
  return useQuery({
    queryKey: ["productRating", productId],
    queryFn: () => getProductRating(productId),
    enabled: !!productId,
  });
}

export function useSubmitRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      value,
    }: {
      productId: string;
      value: number;
    }) => submitRating(productId, value),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["productRating", variables.productId],
      });
    },
  });
}
