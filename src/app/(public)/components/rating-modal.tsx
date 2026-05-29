"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useProductRating, useSubmitRating } from "@/hooks/use-rating";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

interface RatingModalProps {
  productId: string;
  productName: string;
}

export default function RatingModal({
  productId,
  productName,
}: RatingModalProps) {
  const [open, setOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { isSignedIn, isLoaded } = useUser();
  const { data: ratingData, isLoading } = useProductRating(productId);
  const { mutate: submit, isPending } = useSubmitRating();

  const userRating = ratingData?.userRating ?? 0;
  const [selectedRating, setSelectedRating] = useState(0);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setSelectedRating(userRating);
      setHoveredStar(0);
    }
  };

  const handleSubmit = () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast.error("Faça login para avaliar", { position: "top-center" });
      return;
    }

    if (selectedRating === 0) {
      toast.error("Selecione uma nota", { position: "top-center" });
      return;
    }

    submit(
      { productId, value: selectedRating },
      {
        onSuccess: () => {
          toast.success("Avaliação enviada!", { position: "top-center" });
          setOpen(false);
        },
        onError: (err) => {
          toast.error(err.message, { position: "top-center" });
        },
      },
    );
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Star className="size-4" />
          Avaliar
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Avaliar produto</DrawerTitle>
            <DrawerDescription className="text-base font-medium text-foreground">
              {productName}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center gap-1 px-4 py-6">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= (hoveredStar || selectedRating);
              return (
                <button
                  key={star}
                  type="button"
                  disabled={isPending || isLoading}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="cursor-pointer p-1 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Star
                    className="size-8"
                    fill={isFilled ? "currentColor" : "none"}
                  />
                </button>
              );
            })}
          </div>
          <DrawerFooter>
            <Button
              onClick={handleSubmit}
              disabled={selectedRating === 0 || isPending || isLoading}
              className="w-full cursor-pointer"
            >
              {isPending ? "Enviando..." : "Enviar avaliação"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full cursor-pointer">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>{" "}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
