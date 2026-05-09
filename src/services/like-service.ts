export async function addLike(productId: string) {
  const res = await fetch("/api/likes/add", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

  return res.json();
}

export async function removeLike(productId: string) {
  const res = await fetch("/api/likes/remove", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });

  return res.json();
}

export async function getLikes() {
  const res = await fetch("/api/likes");

  return res.json();
}

export async function isProductLiked(productId: string) {
  const res = await fetch(`/api/likes/check?productId=${productId}`);

  return res.json();
}

export async function getProductLikeCount(productId: string) {
  const res = await fetch(`/api/likes/count?productId=${productId}`);

  return res.json();
}
