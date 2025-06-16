import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import axios from "axios"

const CLIENT_FOLDER = 'distribuidora_maipu';

interface Product {
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const Admin: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<
    (Product & { id: string })[]
  >([]);

  // Traer categorías desde Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const docSnap = await getDocs(collection(db, 'config'));
      const configData = docSnap.docs[0]?.data();
      if (configData?.categories) {
        setCategories(configData.categories);
      }
    };
    fetchCategories();
  }, []);

  // Cargar productos al inicio
  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, 'products'));
      const list = snap.docs.map((doc) => ({
        ...(doc.data() as Product),
        id: doc.id,
      }));
      setProducts(list);
    };
    fetchProducts();
  }, [])

  // Maneja la carda de imagen a Cloudinary
  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'chatlink_unsigned');
    formData.append('folder', CLIENT_FOLDER);

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dxksxp1nx/image/upload',
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  };

  // Agrega nueva categoría a Firestore
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const configRef = doc(db, 'config', 'global');
      await updateDoc(configRef, {
        categories: arrayUnion(newCategory.trim()),
      });
      setCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory('');
    } catch (error) {
      console.error('Error agregando categoría', error);
    }
  };

  // Guarda producto en Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageUrl = await handleImageUpload();
    if(!imageUrl) {
      alert('Error subiendo la imagen');
      return;
    }

    const newProduct: Product = {
      name,
      price,
      imageUrl,
      category,
    };

    try {
      await addDoc(collection(db, 'products'), newProduct);
      alert('Producto agregado con éxito');
      // Reset form
      setName('');
      setPrice(0);
      setImageFile(null);
      setCategory('');
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  };

  // Eliminar un producto
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>Panel de Administrador</h2>

      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input 
        type="text"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        />

        <label>Precio:</label>
        <input 
          type="number"
          value={price}
          required
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <label>Imagen:</label>
        <input 
          type="file"
          accept="image/*"
          required
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
        />

        <label>Categoría:</label>
        <select 
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Selecionar</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button type="submit" style={{ marginTop: 10 }}>
          Agregar Producto
        </button>
      </form>

      <hr />

      <h3>Agregar nueva categoría</h3>
      <input 
        type="text"
        placeholder="Ej: Perro adulto"
        value={newCategory}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={handleAddCategory}>Agregar Categoría</button>

      <hr style={{ margin: '2rem 0' }}/>
      
      <h2>Productos cargados</h2>
      <ul>
        {products.map((prod) => (
          <li
            key={prod.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img src={prod.imageUrl} alt={prod.name} width={50} height={50} />
            <div>
              <strong>{prod.name}</strong> - ${prod.price}
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                Categoría: {prod.category}
              </div>
            </div>
            <button
              onClick={() => handleDelete(prod.id)}
              style={{ marginLeft: 'auto', backgroundColor: '#f44336', color: 'white' }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Admin;