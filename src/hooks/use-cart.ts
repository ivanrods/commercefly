import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  decrementCartItem,
  getCart,
  removeFromCart,
} from "src/services/cart-service";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
}

export function useAddCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useDecrementCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: decrementCartItem,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useRemoveCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}
