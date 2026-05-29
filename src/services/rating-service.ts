export async function submitRating(productId: string, value: number) {
  const res = await fetch("/api/ratings", {
    method: "POST",
    body: JSON.stringify({ productId, value }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Erro ao enviar avaliação");
  }

  return data;
}

export async function getProductRating(productId: string) {
  const res = await fetch(`/api/ratings?productId=${productId}`);

  return res.json();
}
