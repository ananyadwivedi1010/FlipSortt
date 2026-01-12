
import { Product } from './types';

export const COLORS = {
  flipkartBlue: '#2874f0',
  flipkartYellow: '#fb641b',
  success: '#388e3c',
  error: '#d32f2f',
  warning: '#fbc02d'
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Apple iPhone 15 (Black, 128 GB)',
    price: 65999,
    originalPrice: 79900,
    rating: 4.6,
    reviewCount: 4520,
    image: 'https://picsum.photos/id/160/400/400',
    category: 'Mobiles',
    seller: 'SuperComNet',
    description: 'Experience the innovative dynamic island on iPhone 15...',
    reviews: [
      {
        id: 'r1',
        user: 'Ankit Sharma',
        rating: 5,
        comment: 'Brilliant phone! The camera is a huge upgrade from the 13. Battery life is solid.',
        date: '2023-11-20',
        isVerified: true
      },
      {
        id: 'r2',
        user: 'Bot_User_99',
        rating: 5,
        comment: 'GOOD PRODUCT VERY GOOD AMAZING SHIP FAST BUY NOW BEST PRICE.',
        date: '2023-11-21',
        isVerified: false
      },
      {
        id: 'r3',
        user: 'Rahul V.',
        rating: 4,
        comment: 'Nice display, but heating slightly during gaming. Overall good.',
        date: '2023-11-19',
        isVerified: true
      }
    ]
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    price: 29990,
    originalPrice: 34990,
    rating: 4.8,
    reviewCount: 1200,
    image: 'https://picsum.photos/id/1/400/400',
    category: 'Audio',
    seller: 'RetailNet',
    description: 'Industry leading noise cancellation with dual noise sensor technology...',
    reviews: []
  }
];
