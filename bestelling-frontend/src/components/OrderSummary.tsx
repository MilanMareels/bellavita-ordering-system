import { ShoppingCart, X, Trash2, CreditCard } from "lucide-react";
import type { OrderSummaryProps } from "../types";

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, onRemove, onClear, total }) => {
  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col h-full shadow-2xl z-10 shrink-0">
      <div className="p-6 border-b border-gray-800 bg-gray-900">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart size={20} className="text-indigo-500" />
            Huidige Bestelling
          </h2>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">Tafel 8</span>
        </div>
        <p className="text-gray-500 text-xs uppercase tracking-wider">
          {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
            <ShoppingCart size={48} className="mb-4" />
            <p>Nog geen producten</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.cartId} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700 group">
              <div className="flex-1">
                <div className="text-white font-medium">{item.naam}</div>
                <div className="text-gray-500 text-xs">1 x €{item.prijs.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-mono">€{item.prijs.toFixed(2)}</span>
                <button onClick={() => onRemove(item.cartId)} className="text-gray-500 hover:text-red-500 transition p-1 rounded hover:bg-gray-700">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-800 p-6 border-t border-gray-700">
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Subtotaal</span>
            <span>€{(total * 0.79).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>BTW (21%)</span>
            <span>€{(total * 0.21).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white text-3xl font-bold mt-4 pt-4 border-t border-gray-700">
            <span>Totaal</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClear}
            disabled={cart.length === 0}
            className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} /> WIS
          </button>
          <button
            disabled={cart.length === 0}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 py-4 rounded-xl font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-1"
          >
            <CreditCard size={20} /> BETAAL
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
