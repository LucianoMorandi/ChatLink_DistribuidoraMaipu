import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import logo from "../assets/logo_distribuidora_maipu.jpg"; // Asegurate de tener el logo aquí
import portada from "../assets/portada_distribuidora_maipu.jpg"; // Imagen de bienvenida
import { Link } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedByCategory = categories.map((cat) => ({
    category: cat,
    items: filteredProducts.filter((p) => p.category === cat),
  }));

  const toggleCategory = (cat: string) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando productos...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Portada */}
      <div className="w-full">
        <img src={portada} alt="portada" className="w-full max-h-60 object-cover" />
      </div>

      {/* Logo y bienvenida */}
      <div className="text-center my-4">
        <img src={logo} alt="logo" className="h-20 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">¡Bienvenidos a Distribuidora Maipú!</h1>
        <p className="text-gray-600">Seleccioná una marca o buscá tu producto.</p>
      </div>

      {/* Buscador */}
      <div className="flex justify-center mb-4 px-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full max-w-md px-4 py-2 border rounded shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desplegables por marca */}
      <div className="px-4 space-y-4">
        {groupedByCategory.map(({ category, items }) => (
          <div key={category} className="bg-white rounded shadow">
            <button
              onClick={() => toggleCategory(category)}
              className="w-full text-left px-4 py-3 font-semibold text-white bg-blue-600 rounded-t hover:bg-blue-700 transition"
            >
              {category}
            </button>
            {activeCategory === category && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {items.length > 0 ? (
                  items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500">
                    No hay productos para esta marca.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Admin link */}
      <div className="text-center mt-10">
        <Link to="/login" className="text-sm text-blue-600 underline">
          Acceso administrador
        </Link>
      </div>
    </div>
  );
};

export default Home;
