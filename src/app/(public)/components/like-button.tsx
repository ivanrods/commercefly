"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import {
  useAddLike,
  useRemoveLike,
  useIsLiked,
  useLikeCount,
} from "@/hooks/use-likes";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  productId: string;
  className?: string;
  showCount?: boolean;
}

export default function LikeButton({
  productId,
  className,
  showCount = true,
}: LikeButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const { mutate: addLike, isPending: isAddingLike } = useAddLike();
  const { mutate: removeLike, isPending: isRemovingLike } = useRemoveLike();
  const { data: likedData } = useIsLiked(productId);
  const { data: countData } = useLikeCount(productId);

  const [optimisticIsLiked, setOptimisticIsLiked] = useState<boolean | null>(
    null,
  );
  const [optimisticLikeCount, setOptimisticLikeCount] = useState<number | null>(
    null,
  );

  const isLiked = optimisticIsLiked ?? likedData?.isLiked ?? false;
  const likeCount = optimisticLikeCount ?? countData?.count ?? 0;

  const handleLikeClick = async () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast.error("Faça login para adicionar aos favoritos", {
        position: "top-center",
      });
      router.push("/sign-in");
      return;
    }

    if (isAddingLike || isRemovingLike) return;

    try {
      if (isLiked) {
        setOptimisticIsLiked(false);
        setOptimisticLikeCount(Math.max(0, likeCount - 1));
        removeLike(productId);
      } else {
        setOptimisticIsLiked(true);
        setOptimisticLikeCount(likeCount + 1);
        addLike(productId);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setOptimisticIsLiked(null);
      setOptimisticLikeCount(null);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isAddingLike || isRemovingLike || !isLoaded}
      className={cn(
        "inline-flex items-center gap-2 rounded-md p-2 transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isLiked && "text-red-500",
        className,
      )}
      title={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        className={cn("size-6 transition-all", isLiked && "fill-current")}
      />
      {showCount && <span className="text-sm font-medium">{likeCount}</span>}
    </button>
  );
}
