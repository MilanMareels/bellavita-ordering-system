import { useEffect, useState } from "react";
import type { Product } from "../types";

export const useProducts = (authFetch: any, user: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Alles");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    authFetch("/api/products")
      .then((res: Response) => res.json())
      .then((data: Product[]) => setProducts(data))
      .catch(console.error);
  }, [user]);

  const addProduct = (newProduct: Omit<Product, "id">) => {
    authFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
    })
      .then((res: any) => res.json())
      .then((saved: any) => setProducts((prev) => [...prev, saved]));
  };

  const deleteProduct = (id: number) => {
    return authFetch(`/api/products/${id}`, { method: "DELETE" }).then(() => setProducts((prev) => prev.filter((p) => p.id !== id)));
  };

  const categories = ["Alles", ...new Set(products.map((p) => p.categorie))];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === "Alles" || p.categorie === selectedCategory;

    const matchSearch = p.naam.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchSearch;
  });

  return {
    products,
    addProduct,
    deleteProduct,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    categories,
  };
};
