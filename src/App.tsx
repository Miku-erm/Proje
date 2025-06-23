import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

// Global State
const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('CartContext must be used within CartProvider');
  return context;
};

// Tab Navigation Component
const Tabs = () => {
  const location = useLocation();

  const tabs = [
    { path: '/products', label: 'Ürünler' },
    { path: '/categories', label: 'Kategoriler' },
    { path: '/cart', label: 'Sepet' },
    { path: '/contact', label: 'İletişim' },
  ];

  return (
    <div className="flex justify-center space-x-6 bg-blue-100 p-4 rounded-lg mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={clsx(
            "px-4 py-2 rounded-lg",
            location.pathname === tab.path ? "bg-blue-500 text-white" : "hover:bg-blue-200"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

// Pages
const Products = () => {
  const { addToCart } = useCart();
  const products: Product[] = [
    { id: 1, name: 'Kablosuz Kulaklık', price: 100, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Akıllı Saat', price: 150, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Bluetooth Hoparlör', price: 200, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Taşınabilir Şarj Cihazı', price: 120, image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Dizüstü Bilgisayar', price: 5000, image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Tablet', price: 3000, image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="p-6 w-full">
      <Tabs />
      <h2 className="text-2xl font-semibold mb-4">Ürünler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-2xl p-4 shadow hover:shadow-lg transition">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-4 rounded" />
            <h3 className="text-lg font-medium mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">Fiyat: {product.price} TL</p>
            <button onClick={() => addToCart(product)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">Sepete Ekle</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Categories = () => {
  return (
    <div className="p-6 w-full">
      <Tabs />
      <h2 className="text-2xl font-semibold mb-4">Kategoriler</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Elektronik</li>
        <li>Aksesuarlar</li>
        <li>Bilgisayar</li>
        <li>Telefon</li>
      </ul>
    </div>
  );
};

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePurchase = () => {
    alert('Satın alma başarılı!');
    clearCart();
  };

  return (
    <div className="p-6 w-full">
      <Tabs />
      <h2 className="text-2xl font-semibold mb-4">Sepetim</h2>
      {cart.length === 0 ? <p className="text-gray-600">Sepetiniz boş.</p> : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <span className="block font-medium">{item.name}</span>
                <span className="text-gray-600 text-sm">{item.price} TL</span>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline">Çıkar</button>
            </div>
          ))}
          <div className="font-bold text-lg flex justify-between border-t pt-4">
            <span>Toplam:</span>
            <span>{total} TL</span>
          </div>
          <button onClick={handlePurchase} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full mt-4">Satın Al</button>
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string; message: string }>();

  const onSubmit = (data: { name: string; message: string }) => {
    alert(`Mesaj gönderildi:\nİsim: ${data.name}\nMesaj: ${data.message}`);
  };

  return (
    <div className="p-6 w-full">
      <Tabs />
      <h2 className="text-2xl font-semibold mb-4">İletişim Formu</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1">İsim:</label>
          <input {...register('name', { required: true })} className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.name && <p className="text-red-500 text-sm mt-1">İsim zorunlu.</p>}
        </div>
        <div>
          <label className="block mb-1">Mesaj:</label>
          <textarea {...register('message', { required: true })} className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.message && <p className="text-red-500 text-sm mt-1">Mesaj zorunlu.</p>}
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">Gönder</button>
      </form>
    </div>
  );
};

// App Component
export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 w-full">
        <Router>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      </div>
    </CartProvider>
  );
}
