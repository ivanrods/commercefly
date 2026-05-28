export async function submitRating(productId: string, value: number) {
  const res = await fetch("/api/ratings", {
    method: "POST",
    body: JSON.stringify({ productId, value }),
  });

  return res.json();
}

export async function getProductRating(productId: string) {
  const res = await fetch(`/api/ratings?productId=${productId}`);

  return res.json();
}
