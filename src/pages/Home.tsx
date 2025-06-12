import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const Home = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch (error) {
                console.error('Error al obtener productos', error);
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return (
            <p className="text-center mt-10">Cargando productos...</p>
        )
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Catálogo de productos</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default Home