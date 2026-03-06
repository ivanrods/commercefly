import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const images = [
  "https://i.ibb.co/QgVSCk8/banner1.png",
  "https://i.ibb.co/xq0mpFgZ/banner2.png",
  "https://i.ibb.co/gGxnTST/banner3.png",
];

export function CarouselBanners() {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="relative w-full h-24 sm:h-32 md:h-40 lg:h-60 xl:h-80">
              <Image
                src={src}
                fill
                alt={`Banner ${index}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
