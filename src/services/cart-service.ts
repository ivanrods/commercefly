export async function addToCart(productId: string) {
  await fetch("/api/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function getCart() {
  const res = await fetch("/api/cart");

  return res.json();
}

export async function removeFromCart(productId: string) {
  await fetch("/api/cart/remove", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function decrementCartItem(productId: string) {
  await fetch("/api/cart/decrement", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}
