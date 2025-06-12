import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "../types/products";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProduct((prev) => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addDoc(collection(db, 'products'), product)
            alert('Producto agregado con éxito')
            navigate('/')
        } catch (error) {
            console.error('Error al agregar producto:', error)
            alert('Ocurrió un error al agregar el producto')
        }
    }

    return (
    <div className="max-w-xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Agregar producto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={product.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={product.description}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={product.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={product.category}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="URL de imagen (Cloudinary)"
          value={product.image}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Guardar producto
        </button>
      </form>
    </div>
  )
}

export default Admin