import type { Product } from "../types/products";

interface Props {
    product: Product
}

const ProductCard = ({ product }: Props) => {
    const handleBuy = () => {
        const message = encodeURIComponent(
            `Hola, quiero comprar el siguiente producto:\n\n` + 
            `🛍 Producto: ${product.name}\n💵 Precio: $${product.price}\n\n` + 
            `Mi nombre es: [Tu nombre]\nMi dirección es: [Tu dirección]\n` + 
            `Método de pago: [Efectivo o Transferencia]`
        )
        window.open(`https://wa.me/5492615910935?text=${message}`, '_blank')
    }

    return (
        <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8}}>
            <img src={product.image} alt={product.name} width="100%" />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>${product.price}</strong>
            <br />
            <button onClick={handleBuy} style={{ marginTop: 8 }}>Comprar por WhatsApp</button>
        </div>
    )
}

export default ProductCard