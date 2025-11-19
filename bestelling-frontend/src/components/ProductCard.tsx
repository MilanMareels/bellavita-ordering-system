import { Pizza, Coffee, Utensils } from "lucide-react";
import type { ProductCardProps } from "../types";

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Eten":
        return "bg-emerald-600 hover:bg-emerald-500 border-emerald-700";
      case "Drinken":
        return "bg-blue-600 hover:bg-blue-500 border-blue-700";
      case "Dessert":
        return "bg-purple-600 hover:bg-purple-500 border-purple-700";
      default:
        return "bg-gray-700 hover:bg-gray-600 border-gray-600";
    }
  };

  return (
    <button
      onClick={() => onClick(product)}
      className={`${getCategoryColor(product.categorie)} 
        relative h-32 w-full rounded-xl border-b-4 active:border-b-0 active:mt-1 
        flex flex-col justify-between p-4 text-white transition-all shadow-lg group overflow-hidden`}
    >
      <div className="font-bold text-lg text-left leading-tight w-full drop-shadow-md">{product.naam}</div>
      <div className="text-right font-mono text-xl font-semibold opacity-90">€{product.prijs.toFixed(2)}</div>
      <div className="absolute -bottom-4 -left-4 opacity-20 transform group-hover:scale-110 transition-transform">
        {product.categorie === "Eten" && <Pizza size={60} />}
        {product.categorie === "Drinken" && <Coffee size={60} />}
        {product.categorie === "Dessert" && <Utensils size={60} />}
      </div>
    </button>
  );
};

export default ProductCard;
