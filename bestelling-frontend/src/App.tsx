import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";

import Sidebar from "./components/Sidebar";
import LoginScreen from "./components/LoginScreen";
import OrderSummary from "./components/OrderSummary";
import ProductCard from "./components/ProductCard";
import AdminPanel from "./components/admin/AdminPanel";

import type { UserProfile, Product, CartItem } from "./types";

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("kassa_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Alles");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("kassa");
  const [loginError, setLoginError] = useState<string>("");

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!user?.password) throw new Error("Missing user credentials");

    const base64 = btoa(`${user.username}:${user.password}`);

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Basic " + base64,
      ...(options.headers || {}),
    };

    return fetch(url, { ...options, headers });
  };

  useEffect(() => {
    if (!user) return;

    authFetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Kan producten niet ophalen");
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((err) => console.error(err));
  }, [user]);

  const handleLogin = async (username: string, password: string) => {
    try {
      const base64 = btoa(`${username}:${password}`);

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: "Basic " + base64 },
      });

      if (!res.ok) {
        setLoginError("Ongeldige inloggegevens");
        return;
      }

      const serverUser = await res.json();

      const loggedInUser: UserProfile = {
        username,
        password,
        role: serverUser.role,
      };

      setUser(loggedInUser);
      localStorage.setItem("kassa_user", JSON.stringify(loggedInUser));
      setLoginError("");
    } catch (err) {
      setLoginError("Server niet bereikbaar");
    }
  };

  const handleLogout = (): void => {
    setUser(null);
    localStorage.removeItem("kassa_user");
    setCart([]);
    setActiveTab("kassa");
  };

  const handleAddProduct = (newProductData: Omit<Product, "id">) => {
    authFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(newProductData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Product toevoegen mislukt");
        return res.json();
      })
      .then((savedProduct: Product) => {
        setProducts((prev) => [...prev, savedProduct]);
      })
      .catch((err) => alert(err.message));
  };

  const handleDeleteProduct = (id: number) => {
    if (!window.confirm("Product verwijderen?")) return;

    authFetch(`/api/products/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Geen rechten");
          throw new Error("Verwijderen mislukt");
        }
        setProducts((p) => p.filter((prod) => prod.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  const addToCart = (product: Product): void => {
    const newItem: CartItem = { ...product, cartId: Date.now() };
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (cartId: number): void => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.prijs, 0);

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === "Alles" || p.categorie === selectedCategory;
    const matchSearch = p.naam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = ["Alles", ...new Set(products.map((p) => p.categorie))];

  if (!user) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="flex min-h-svh min-w-svw bg-gray-900 text-white font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} isAdmin={user.role === "ROLE_ADMIN"} />

      {activeTab === "admin" ? (
        <AdminPanel products={products} onAdd={handleAddProduct} onDelete={handleDeleteProduct} />
      ) : (
        <div className="flex-1 flex flex-col">
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

            <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap ${selectedCategory === cat ? "bg-white text-gray-900" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
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

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={addToCart} />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "kassa" && <OrderSummary cart={cart} total={totalPrice} onRemove={removeFromCart} onClear={() => setCart([])} />}
    </div>
  );
};

export default App;
