import React, { useState, useEffect } from "react";
import { ShoppingCart, Trash2, Pizza, Coffee, Utensils, Search, X, Menu, Plus } from "lucide-react";

// --- TYPES & INTERFACES ---
interface Product {
  id: number;
  naam: string;
  prijs: number;
  categorie: string;
}

interface CartItem extends Product {
  cartId: number;
}

interface User {
  username: string;
  password?: string;
  role: string;
}

interface NewProductState {
  naam: string;
  prijs: string;
  categorie: string;
}

// --- STYLING ---
const styles = `
* { box-sizing: border-box; }
body { margin: 0; font-family: 'Segoe UI', sans-serif; background-color: #f3f4f6; color: #333; overflow: hidden; }
.app-container { display: flex; height: 100vh; width: 100vw; }
/* Login Screen */
.login-container { height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; background: #1f2937; }
.login-box { background: white; padding: 40px; border-radius: 12px; width: 350px; text-align: center; }
.login-box input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
.login-btn { width: 100%; padding: 10px; background: #fbbf24; border: none; font-weight: bold; cursor: pointer; border-radius: 4px; }
/* Sidebar */
.sidebar { width: 250px; background-color: #1f2937; color: white; display: flex; flex-direction: column; padding: 20px; flex-shrink: 0; }
.sidebar .logo { margin-bottom: 40px; text-align: center; }
.nav-item { display: flex; gap: 15px; padding: 15px; background: transparent; border: none; color: #d1d5db; font-size: 1.1rem; cursor: pointer; width: 100%; text-align: left; border-radius: 12px; }
.nav-item:hover { background: rgba(255,255,255, 0.1); }
.nav-item.active { background: #fbbf24; color: #1f2937; font-weight: bold; }
/* Main */
.main-content { flex-grow: 1; padding: 30px; overflow-y: auto; position: relative; }
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.search-bar { display: flex; align-items: center; background: white; padding: 10px 15px; border-radius: 30px; width: 300px; }
.search-bar input { border: none; outline: none; margin-left: 10px; width: 100%; }
/* Admin Panel */
.admin-panel { background: white; padding: 15px; margin-bottom: 20px; border-radius: 12px; border: 2px dashed #fbbf24; display: flex; gap: 10px; align-items: center; }
.admin-panel input, .admin-panel select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
/* Product Grid */
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; padding-bottom: 80px; }
.product-card { background: white; border-radius: 16px; padding: 20px; text-align: center; position: relative; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.delete-product-btn { position: absolute; top: 10px; right: 10px; background: #ef4444; color: white; border: none; padding: 5px; border-radius: 50%; cursor: pointer; z-index: 10; }
.card-icon { background: #eff6ff; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px auto; }
.add-btn { position: absolute; bottom: 0; right: 0; background: #fbbf24; border: none; width: 40px; height: 40px; border-top-left-radius: 16px; font-size: 1.5rem; cursor: pointer; }
/* Cart */
.floating-cart { position: fixed; bottom: 30px; right: 30px; background: #1f2937; color: white; padding: 15px 25px; border-radius: 50px; display: flex; align-items: center; gap: 20px; cursor: pointer; z-index: 100; }
.cart-overlay { position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; justify-content: flex-end; }
.cart-sidebar { width: 400px; background: white; height: 100%; display: flex; flex-direction: column; padding: 20px; }
.receipt-preview { flex-grow: 1; overflow-y: auto; font-family: 'Courier New', monospace; }
.cart-actions { margin-top: 20px; display: flex; gap: 10px; }
.cart-actions button { flex: 1; padding: 15px; border: none; cursor: pointer; border-radius: 4px; color: white; }
@media print { .no-print { display: none !important; } .receipt-preview { width: 100%; } }
`;

function App() {
  // --- STATE ---
  // AANPASSING 1: Check eerst localStorage bij het starten
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("kassa_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Alles");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [newProd, setNewProd] = useState<NewProductState>({ naam: "", prijs: "", categorie: "Eten" });

  // --- API HELPER ---
  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (!user || !user.password) return Promise.reject("No user credentials");
    const safeBase64 = btoa(unescape(encodeURIComponent(`${user.username}:${user.password}`)));
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: "Basic " + safeBase64,
    };
    return fetch(url, { ...options, headers });
  };

  // --- DATA LADEN ---
  useEffect(() => {
    if (user) {
      authFetch("/api/products")
        .then((res) => {
          if (!res.ok) throw new Error("Niet toegestaan");
          return res.json();
        })
        .then((data: Product[]) => setProducts(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  // --- LOGIN LOGICA ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = { username: usernameInput, password: passwordInput };

    try {
      const safeBase64 = btoa(unescape(encodeURIComponent(`${credentials.username}:${credentials.password}`)));
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: "Basic " + safeBase64 },
      });

      if (res.ok) {
        const userData = await res.json();
        const loggedInUser = { username: credentials.username, password: credentials.password, role: userData.role };

        // AANPASSING 2: Sla op in state EN localStorage
        setUser(loggedInUser);
        localStorage.setItem("kassa_user", JSON.stringify(loggedInUser));

        setError("");
      } else {
        setError("Foute inloggegevens");
      }
    } catch (err) {
      setError("Server onbereikbaar");
    }
  };

  const handleLogout = () => {
    // AANPASSING 3: Verwijder uit state EN localStorage
    setUser(null);
    localStorage.removeItem("kassa_user");

    setCart([]);
    setUsernameInput("");
    setPasswordInput("");
  };

  // --- ADMIN ACTIES ---
  const handleAddProduct = () => {
    if (!newProd.naam || !newProd.prijs) return alert("Vul alle velden in");

    const cleanPrijs = newProd.prijs.toString().replace(",", ".");
    const prijsGetal = parseFloat(cleanPrijs);

    if (isNaN(prijsGetal)) return alert("Ongeldige prijs");

    authFetch("/api/products", {
      method: "POST",
      body: JSON.stringify({ ...newProd, prijs: prijsGetal }),
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Geen rechten (Ben je admin?)");
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((savedProduct: Product) => {
        setProducts([...products, savedProduct]);
        setNewProd({ naam: "", prijs: "", categorie: "Eten" });
      })
      .catch((err) => {
        console.error(err);
        alert(err.message);
      });
  };

  const handleDeleteProduct = (id: number) => {
    if (!window.confirm("Zeker weten verwijderen?")) return;

    authFetch(`/api/products/${id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 403) throw new Error("Geen rechten");
          throw new Error("Kon niet verwijderen");
        }
        setProducts(products.filter((p) => p.id !== id));
      })
      .catch((err) => alert(err.message));
  };

  // --- WINKELWAGEN LOGICA ---
  const addToCart = (product: Product) => {
    const newItem: CartItem = { ...product, cartId: Date.now() };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (cartId: number) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.prijs, 0);

  // --- RENDER: LOGIN ---
  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <div className="login-container">
          <div className="login-box">
            <h2>🔐 Kassa Login</h2>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Gebruikersnaam" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
              <input type="password" placeholder="Wachtwoord" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button type="submit" className="login-btn">
                Inloggen
              </button>
            </form>
            <p style={{ fontSize: "0.8rem", marginTop: "20px", color: "#666" }}>
              Demo accounts:
              <br />
              admin / 1234
              <br />
              user / 1234
            </p>
          </div>
        </div>
      </>
    );
  }

  // --- RENDER: APP ---
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "Alles" || p.categorie === selectedCategory;
    const matchesSearch = p.naam.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["Alles", ...new Set(products.map((p) => p.categorie || "Overig"))];
  const isAdmin = user.role === "ROLE_ADMIN";

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        <nav className="sidebar no-print">
          <div className="logo">
            <h2>🍕 Gusto</h2>
            <p>
              Ingelogd als: <strong>{user.username}</strong>
            </p>
            <button onClick={handleLogout} style={{ background: "none", border: "1px solid #666", color: "#ccc", padding: "5px", marginTop: "10px", cursor: "pointer" }}>
              Uitloggen
            </button>
          </div>
          <div className="nav-links">
            {categories.map((cat) => (
              <button key={cat} className={`nav-item ${selectedCategory === cat ? "active" : ""}`} onClick={() => setSelectedCategory(cat)}>
                {cat === "Eten" && <Pizza size={20} />}
                {cat === "Drinken" && <Coffee size={20} />}
                {cat === "Dessert" && <Utensils size={20} />}
                {cat === "Alles" && <Menu size={20} />}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="main-content no-print">
          <header className="top-bar">
            <h1>Bestellingen</h1>
            <div className="search-bar">
              <Search size={18} />
              <input type="text" placeholder="Zoek..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </header>

          {isAdmin && (
            <div className="admin-panel">
              <strong>Nieuw Product:</strong>
              <input placeholder="Naam" value={newProd.naam} onChange={(e) => setNewProd({ ...newProd, naam: e.target.value })} />
              <input type="text" inputMode="decimal" placeholder="Prijs" value={newProd.prijs} onChange={(e) => setNewProd({ ...newProd, prijs: e.target.value })} style={{ width: "80px" }} />
              <select value={newProd.categorie} onChange={(e) => setNewProd({ ...newProd, categorie: e.target.value })}>
                <option value="Eten">Eten</option>
                <option value="Drinken">Drinken</option>
                <option value="Dessert">Dessert</option>
              </select>
              <button onClick={handleAddProduct} style={{ background: "#10b981", color: "white", border: "none", padding: "8px", borderRadius: "4px", cursor: "pointer" }}>
                <Plus size={18} /> Toevoegen
              </button>
            </div>
          )}

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                {isAdmin && (
                  <button
                    className="delete-product-btn"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="card-icon">{product.categorie === "Drinken" ? <Coffee size={40} /> : product.categorie === "Dessert" ? <Utensils size={40} /> : <Pizza size={40} />}</div>
                <div className="card-info">
                  <h3>{product.naam}</h3>
                  <span className="price">€ {product.prijs.toFixed(2)}</span>
                </div>
                <button className="add-btn">+</button>
              </div>
            ))}
          </div>
        </main>

        {!isCartOpen && (
          <div className="floating-cart no-print" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart color="white" /> <span className="badge">{cart.length}</span>
            <div className="cart-total">
              <small>Totaal</small>
              <strong>€ {totalPrice.toFixed(2)}</strong>
            </div>
          </div>
        )}

        {isCartOpen && (
          <div className="cart-overlay">
            <div className="cart-sidebar">
              <div className="cart-header no-print">
                <h2>Bestelling</h2> <X style={{ cursor: "pointer" }} onClick={() => setIsCartOpen(false)} />
              </div>
              <div className="receipt-preview printable-area">
                <div className="receipt-header">
                  <h3>PIZZERIA GUSTO</h3>
                  <p>{new Date().toLocaleString()}</p>
                  <hr />
                </div>
                <table>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.cartId}>
                        <td>{item.naam}</td>
                        <td align="right">€ {item.prijs.toFixed(2)}</td>
                        <td
                          className="no-print"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            removeFromCart(item.cartId);
                          }}
                          style={{ color: "red", cursor: "pointer" }}
                        >
                          x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <hr />
                <h3>Totaal: € {totalPrice.toFixed(2)}</h3>
              </div>
              <div className="cart-actions no-print">
                <button style={{ background: "#ef4444" }} onClick={clearCart}>
                  Wis
                </button>
                <button style={{ background: "#10b981" }} onClick={() => window.print()}>
                  Print
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
