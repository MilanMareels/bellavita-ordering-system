import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { AdminPanelProps, NewProductInput } from "../../types";

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onAdd, onDelete }) => {
  const [newProd, setNewProd] = useState<Omit<NewProductInput, "id"> & { prijs: string }>({
    naam: "",
    prijs: "0.00",
    categorie: "Eten",
  });

  const handleAdd = () => {
    if (!newProd.naam || !newProd.prijs) return;

    const prijsNum = parseFloat(newProd.prijs);
    if (isNaN(prijsNum)) return;

    onAdd({
      ...newProd,
      prijs: prijsNum,
    });

    setNewProd({ naam: "", prijs: "0.00", categorie: "Eten" });
  };

  return (
    <div className="flex-1 bg-gray-900 p-8 overflow-y-auto">
      <h2 className="text-3xl text-white font-bold mb-8">Productbeheer</h2>

      {/* Toevoegen */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8 max-w-4xl">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} /> Nieuw Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Productnaam"
            className="bg-gray-900 text-white border border-gray-600 rounded-lg p-3 outline-none focus:border-indigo-500"
            value={newProd.naam}
            onChange={(e) => setNewProd({ ...newProd, naam: e.target.value })}
          />
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">€</span>
            <input
              placeholder="0.00"
              type="text"
              className="bg-gray-900 text-white border border-gray-600 rounded-lg p-3 pl-8 w-full outline-none focus:border-indigo-500"
              value={newProd.prijs}
              onChange={(e) => setNewProd({ ...newProd, prijs: e.target.value })}
            />
          </div>
          <select
            className="bg-gray-900 text-white border border-gray-600 rounded-lg p-3 outline-none focus:border-indigo-500"
            value={newProd.categorie}
            onChange={(e) => setNewProd({ ...newProd, categorie: e.target.value })}
          >
            <option value="Eten">Eten</option>
            <option value="Drinken">Drinken</option>
            <option value="Dessert">Dessert</option>
          </select>
          <button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-lg">
            Toevoegen
          </button>
        </div>
      </div>

      {/* Lijst */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden max-w-4xl">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4">Naam</th>
              <th className="p-4">Categorie</th>
              <th className="p-4 text-right">Prijs</th>
              <th className="p-4 text-center">Actie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-gray-300">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-700/50">
                <td className="p-4 font-medium text-white">{p.naam}</td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.categorie === "Eten" ? "bg-emerald-500/20 text-emerald-400" : p.categorie === "Drinken" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {p.categorie}
                  </span>
                </td>
                <td className="p-4 text-right font-mono">€{p.prijs.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <button onClick={() => onDelete(p.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
