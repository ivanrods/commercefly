"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addLike,
  removeLike,
  getLikes,
  isProductLiked,
  getProductLikeCount,
} from "../services/like-service";
import { toast } from "sonner";

export function useLikes() {
  return useQuery({
    queryKey: ["likes"],
    queryFn: getLikes,
  });
}

export function useAddLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addLike,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["isLiked"],
      });
      queryClient.invalidateQueries({
        queryKey: ["likeCount"],
      });
      toast.success("Produto adicionado aos favoritos", {
        position: "top-center",
      });
    },
    onError: (error) => {
      if (error?.message?.includes("already liked")) {
        toast.error("Produto já foi adicionado aos favoritos", {
          position: "top-center",
        });
      } else {
        toast.error("Erro ao adicionar aos favoritos", {
          position: "top-center",
        });
      }
    },
  });
}

export function useRemoveLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeLike,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["likes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["isLiked"],
      });
      queryClient.invalidateQueries({
        queryKey: ["likeCount"],
      });
      toast.success("Removido dos favoritos", {
        position: "top-center",
      });
    },
    onError: () => {
      toast.error("Erro ao remover dos favoritos", {
        position: "top-center",
      });
    },
  });
}

export function useIsLiked(productId: string) {
  return useQuery({
    queryKey: ["isLiked", productId],
    queryFn: () => isProductLiked(productId),
  });
}

export function useLikeCount(productId: string) {
  return useQuery({
    queryKey: ["likeCount", productId],
    queryFn: () => getProductLikeCount(productId),
  });
}
