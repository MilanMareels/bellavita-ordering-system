import { useState } from "react";
import type { CartItem, Product } from "../types";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId: number) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.prijs, 0);

  return { cart, addToCart, removeFromCart, clearCart, totalPrice };
};
