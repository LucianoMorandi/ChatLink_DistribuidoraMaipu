import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CLIENT_FOLDER = "distribuidora_maipu";
const PAGE_SIZE = 5;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const isAuth = localStorage.getItem("auth");
    if (isAuth !== "true") navigate("/login");
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterCategory) {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }
    setFilteredProducts(filtered);
    setPage(1);
  }, [search, filterCategory, products]);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    const list = snap.docs.map((doc) => ({ ...(doc.data() as Product), id: doc.id }));
    setProducts(list);
  };

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, "config"));
    const config = snap.docs[0]?.data();
    if (config?.categories) setCategories(config.categories);
  };

  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "chatlink_unsigned");
    formData.append("folder", CLIENT_FOLDER);
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dxksxp1nx/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (e) {
      console.error("Error subiendo imagen", e);
      return null;
    }
  };

  const handleSave = async () => {
    const imageUrl = imageFile ? await handleImageUpload() : form.image;
    if (!form.name || !form.description || !form.price || !form.category || !imageUrl) {
      alert("Todos los campos son requeridos");
      return;
    }
    const productData = { ...form, image: imageUrl };
    if (editingId) {
      await updateDoc(doc(db, "products", editingId), productData);
    } else {
      await addDoc(collection(db, "products"), productData);
    }
    setForm({ name: "", description: "", price: 0, image: "", category: "" });
    setImageFile(null);
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (prod: Product) => {
    setForm({ ...prod });
    setEditingId(prod.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar producto?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const configRef = doc(db, "config", "global");
    await updateDoc(configRef, {
      categories: arrayUnion(newCategory.trim()),
    });
    setCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const paginated = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded mb-4"
      >
        Cerrar sesión
      </button>

      <h2 className="text-xl font-bold mb-2">Formulario producto</h2>
      <div className="space-y-2">
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-2 py-1"
        />
        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border px-2 py-1"
        />
        <input
          placeholder="Precio"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="w-full border px-2 py-1"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border px-2 py-1"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
        />
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? "Guardar cambios" : "Agregar producto"}
        </button>
      </div>

      <div className="mt-6">
        <input
          placeholder="Nueva categoría"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border px-2 py-1"
        />
        <button onClick={handleAddCategory} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">
          Agregar
        </button>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex gap-2">
          <input
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2 py-1 w-full"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-2 py-1"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {paginated.map((prod) => (
          <div
            key={prod.id}
            className="border p-2 rounded flex gap-4 items-center"
          >
            <img src={prod.image} alt={prod.name} className="w-16 h-16 object-cover" />
            <div className="flex-1">
              <strong>{prod.name}</strong>
              <div>{prod.description}</div>
              <div className="text-sm text-gray-600">{prod.category}</div>
              <div className="font-bold text-green-600">${prod.price}</div>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleEdit(prod)}
                className="bg-yellow-400 px-2 py-1 text-sm rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(prod.id)}
                className="bg-red-500 text-white px-2 py-1 text-sm rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {filteredProducts.length > PAGE_SIZE && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * PAGE_SIZE >= filteredProducts.length}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

