import type { Product } from "../types/products";

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Pedigree adulto',
        description: 'alimento para perros',
        price: 40000,
        imageUrl: 'https://via.placeholder.com/200',
        category: 'Perros adultos'
    },
    {
        id: '2',
        name: 'Pedigree cachorro',
        description: 'alimento para cachorros',
        price: 50000,
        imageUrl: 'https://via.placeholder.com/200',
        category: 'Perros cachorros'
    },
]