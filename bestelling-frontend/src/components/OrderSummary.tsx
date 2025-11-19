import { useRef } from "react";
import { ShoppingCart, X, Trash2, Printer } from "lucide-react";
import type { OrderSummaryProps } from "../types";

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, onRemove, onClear, total }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const formatDate = () => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handelPrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col h-full shadow-2xl z-10 shrink-0">
      <div className="hidden" ref={printRef}>
        <div className="p-4 font-mono text-black">
          <h2 className="text-lg font-bold">KASSATICKET</h2>
          <p className="text-xs">
            {formatDate()} • {formatTime()}
          </p>
          <p className="text-xs mb-2">Tafel 8</p>

          <div className="mt-3">
            {cart.map((item) => (
              <div key={item.cartId} className="flex justify-between text-sm">
                <span>{item.naam} x1</span>
                <span>€{item.prijs.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-3 pt-2">
            <div className="flex justify-between text-sm">
              <span>Subtotaal</span>
              <span>€{(total * 0.79).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>BTW 21%</span>
              <span>€{(total * 0.21).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t">
              <span>Totaal</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart size={20} className="text-indigo-500" />
            Huidige Bestelling
          </h2>
        </div>
        <p className="text-gray-500 text-xs uppercase tracking-wider">
          {formatDate()} • {formatTime()}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-4">Nog geen producten</p>
        ) : (
          cart.map((item) => (
            <div key={item.cartId} className="flex justify-between items-center text-white font-mono bg-gray-800 p-2 rounded">
              <div className="flex-1">
                <span>{item.naam}</span>
                <span className="ml-2 text-gray-400">1 x €{item.prijs.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>€{item.prijs.toFixed(2)}</span>
                <button onClick={() => onRemove(item.cartId)} className="text-red-500 hover:text-white p-1 rounded transition">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-gray-800 p-6 border-t border-gray-700 grid grid-cols-2 gap-3">
        <button
          onClick={onClear}
          disabled={cart.length === 0}
          className="flex items-center justify-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 py-4 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 size={20} /> WIS
        </button>
        <button
          onClick={handelPrint}
          disabled={cart.length === 0}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 py-4 rounded-xl font-bold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-1"
        >
          <Printer size={20} /> PRINT
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
