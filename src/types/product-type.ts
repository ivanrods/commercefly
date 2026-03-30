export type Product = {
  id: string;
  name: string;
  description: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  categoryId: string;
  createdAt: Date;
  images: {
    id: string;
    url: string;
  }[];
  isFeatured: boolean;
  price: number;
  stock: number;
  rating: number;
  stripePriceId: string | null;
  stripeProductId: string | null;
};
