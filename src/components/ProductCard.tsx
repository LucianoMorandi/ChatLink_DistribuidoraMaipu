import type { Product } from "../types/products";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {

  const optimizedUrl = product.image.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_600/"
  );

  const handleBuy = () => {
    const message = encodeURIComponent(
      `Hola Distribuidora Maipú, estoy interesado en este producto:\n\n` +
      `🛍 Producto: ${product.name}\n💵 Precio: $${product.price}\n\n` +
      `¿Podrías darme más información?`
    );

    window.open(`https://wa.me/5492613065967?text=${message}`, "_blank");
  };

  return (
    <div className={styles.card}>
      <img
        src={optimizedUrl}
        alt={product.name}
        loading="lazy"
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
