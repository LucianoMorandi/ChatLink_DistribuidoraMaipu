import type { Product } from "../types/products";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const handleBuy = () => {
    const message = encodeURIComponent(
      `Hola, estoy interesado en este producto:\n\n` +
      `🛍 Producto: ${product.name}\n💵 Precio: $${product.price}\n\n` +
      `¿Podrías darme más información?`
    );

    window.open(`https://wa.me/5492616093134?text=${message}`, "_blank");
  };

  return (
    <div className={styles.card}>
      <img
        src={product.image}
        alt={product.name}
        className={styles.image}
      />
      <h3 className={styles.title}>{product.name}</h3>
      <p className={styles.description}>{product.description}</p>
      <strong className={styles.price}>${product.price}</strong>
      <button onClick={handleBuy} className={styles.buyButton}>
        Comprar por WhatsApp
      </button>
    </div>
  );
};

export default ProductCard;
