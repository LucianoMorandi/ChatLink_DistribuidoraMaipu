import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "../types/products";

export const getProducts = async (): Promise<Product[]> => {
    const productsRef = collection(db, 'products')
    const snapshot = await getDocs(productsRef)

    const products: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Product[]

    return products
}