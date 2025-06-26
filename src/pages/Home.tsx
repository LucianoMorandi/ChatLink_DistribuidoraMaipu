import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import logo from "../assets/logo_distribuidora_maipu.png";
import portada from "../assets/portada2.png";
import styles from "./Home.module.css";
import Footer from "../components/Footer";

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
    return <p className={styles.loading}>Cargando productos...</p>;
  }

  return (
    <div className={styles.container}>
      {/* Portada */}
      <div className={styles.portadaWrapper}>
        <img src={portada} alt="portada" className={styles.portada} />
      </div>

      {/* Logo y bienvenida */}
      <div className={styles.header}>
        <img src={logo} alt="logo" className={styles.logo} />
        <h1 className={styles.title}>¡Bienvenidos a Distribuidora Maipú!</h1>
        <p className={styles.subtitle}>Seleccioná una marca o buscá tu producto.</p>
      </div>

      {/* Buscador */}
      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Buscar producto..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Productos buscados */}
      {search && (
        <div className={styles.productsGrid}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className={styles.noProducts}>No se encontraron productos.</p>
          )}
        </div>
      )}

      {/* Desplegables por marca */}
      {!search && (
        <div className={styles.categoriesWrapper}>
          {groupedByCategory.map(({ category, items }) => (
            <div key={category} className={styles.categoryCard}>
              <button
                onClick={() => toggleCategory(category)}
                className={`${styles.categoryButton} ${
                  activeCategory === category ? styles.activeCategory : ""
                }`}
              >
                {category}
              </button>
              {activeCategory === category && (
                <div className={styles.productsGrid}>
                  {items.length > 0 ? (
                    items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p className={styles.noProducts}>No hay productos para esta marca.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;

