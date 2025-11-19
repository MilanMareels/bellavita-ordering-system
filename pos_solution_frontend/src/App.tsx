import { Search, User } from "lucide-react";

import Sidebar from "./components/Sidebar";
import LoginScreen from "./components/LoginScreen";
import OrderSummary from "./components/OrderSummary";
import ProductCard from "./components/ProductCard";
import AdminPanel from "./components/admin/AdminPanel";

import { useAuth } from "./hooks/useAuth";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";
import { useState } from "react";

const App = () => {
  // AUTH HOOK
  const { user, login, logout, loginError, authFetch } = useAuth();

  // PRODUCT HOOK
  const { products, addProduct, deleteProduct, filteredProducts, categories, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useProducts(authFetch, user);

  // CART HOOK
  const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useCart();

  const [activeTab, setActiveTab] = useState("kassa");

  if (!user) {
    return <LoginScreen onLogin={login} error={loginError} />;
  }

  return (
    <div className="flex min-h-svh min-w-svw bg-gray-900 text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} isAdmin={user.role === "ROLE_ADMIN"} />

      {activeTab === "admin" ? (
        <AdminPanel products={products} onAdd={addProduct} onDelete={deleteProduct} />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Top bar */}
          <div className="p-4 border-b border-gray-800 flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                placeholder="Zoeken..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 pl-10 pr-4"
              />
            </div>

            {/* categorieën */}
            <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold ${selectedCategory === cat ? "bg-white text-gray-900" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold">{user.username}</div>
                <div className="text-xs text-emerald-400">Online</div>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-300" />
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={addToCart} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDER SUMMARY / KASSA */}
      {activeTab === "kassa" && <OrderSummary cart={cart} total={totalPrice} onRemove={removeFromCart} onClear={clearCart} />}
    </div>
  );
};

export default App;
