export interface Product {
  id: number;
  naam: string;
  prijs: number;
  categorie: string;
}

export interface NewProductInput {
  naam: string;
  prijs: string;
  categorie: string;
}

export interface CartItem extends Product {
  cartId: number;
}
export interface UserProfile {
  username: string;
  role: string;
  password: string; // ← toevoegen!
}

export interface LoginScreenProps {
  onLogin: (u: string, p: string) => void;
  error: string;
}

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

export interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export interface OrderSummaryProps {
  cart: CartItem[];
  onRemove: (cartId: number) => void;
  onClear: () => void;
  total: number;
}

export interface AdminPanelProps {
  products: Product[];
  onAdd: (product: Omit<Product, "id">) => void;
  onDelete: (id: number) => void;
}
