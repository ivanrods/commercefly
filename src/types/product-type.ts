export type Product = {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  categoryId: string;
  createdAt: Date;
  imageUrl: string;
  isFeatured: boolean;
  price: number;
  stock: number;
  stripePriceId: string | null;
  stripeProductId: string | null;
};
