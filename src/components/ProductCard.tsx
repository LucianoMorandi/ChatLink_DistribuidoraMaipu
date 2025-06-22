import type { Product } from "../types/products";

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
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-800">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-contain rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">
        {product.description}
      </p>
      <strong className="text-indigo-600 dark:text-indigo-400 text-xl">
        ${product.price}
      </strong>
      <button
        onClick={handleBuy}
        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors duration-200"
      >
        Comprar por WhatsApp
      </button>
    </div>
  );
};

export default ProductCard;
