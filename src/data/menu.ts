export type Category = 'Pizza' | 'Burgers' | 'Shawarma' | 'Deals';

export interface MenuItem {
  id: string;
  category: Category;
  subCategory?: string;
  name: string;
  description?: string;
  ingredients?: string[];
  prices?: { S: number; M: number; L: number };
  price?: number;
  image: string;
}

export const menuItems: MenuItem[] = [
  // Classic Pizza
  { 
    id: 'p1', 
    category: 'Pizza', 
    subCategory: 'Classic Pizza', 
    name: 'Chicken Tikka BBQ', 
    description: 'Traditional tikka chunks with onions and BBQ sauce.',
    ingredients: ['Chicken Tikka', 'Onions', 'BBQ Sauce', 'Mozzarella Cheese'],
    prices: { S: 500, M: 900, L: 1200 }, 
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'p2', 
    category: 'Pizza', 
    subCategory: 'Classic Pizza', 
    name: 'Chicken Fajita', 
    description: 'Fajita chicken, bell peppers, and onions.',
    ingredients: ['Fajita Chicken', 'Bell Peppers', 'Onions', 'Tomato Sauce'],
    prices: { S: 500, M: 900, L: 1200 }, 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'p3', 
    category: 'Pizza', 
    subCategory: 'Classic Pizza', 
    name: 'Chicken Tandoori', 
    description: 'Spicy tandoori chicken with a traditional touch.',
    ingredients: ['Tandoori Chicken', 'Green Chilies', 'Onions', 'Spices'],
    prices: { S: 500, M: 900, L: 1200 }, 
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=800&auto=format&fit=crop' 
  },
  
  // Jand Najjar Special
  { 
    id: 'p4', 
    category: 'Pizza', 
    subCategory: 'Jand Najjar Special', 
    name: 'Jand Najjar Special', 
    description: 'Our signature pizza with everything you love.',
    ingredients: ['Special Sauce', 'Mixed Meat', 'Olives', 'Mushrooms', 'Extra Cheese'],
    prices: { S: 650, M: 1050, L: 1400 }, 
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'p5', 
    category: 'Pizza', 
    subCategory: 'Jand Najjar Special', 
    name: 'Crown Crust', 
    description: 'Stuffed crust pizza with a crown shape.',
    ingredients: ['Cheese Stuffed Crust', 'Chicken', 'Veggies'],
    prices: { S: 650, M: 1050, L: 1400 }, 
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'p6', 
    category: 'Pizza', 
    subCategory: 'Jand Najjar Special', 
    name: 'Kabab Crust', 
    description: 'Delicious kababs embedded in the crust.',
    ingredients: ['Kabab Crust', 'Spicy Chicken', 'Onions'],
    prices: { S: 650, M: 1050, L: 1400 }, 
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=800&auto=format&fit=crop' 
  },
  
  // Royal Pizza
  { 
    id: 'p7', 
    category: 'Pizza', 
    subCategory: 'Royal Pizza', 
    name: 'Malai Boti', 
    description: 'Creamy malai boti chunks for a royal taste.',
    ingredients: ['Malai Boti', 'Cream Sauce', 'Mild Spices'],
    prices: { S: 600, M: 1000, L: 1300 }, 
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'p8', 
    category: 'Pizza', 
    subCategory: 'Royal Pizza', 
    name: 'Lazania', 
    description: 'Lasagna style pizza with rich layers.',
    ingredients: ['Minced Meat', 'White Sauce', 'Layers of Cheese'],
    prices: { S: 600, M: 1000, L: 1300 }, 
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'p9', 
    category: 'Pizza', 
    subCategory: 'Royal Pizza', 
    name: 'BBQ', 
    description: 'Smoky BBQ chicken with a rich sauce.',
    ingredients: ['BBQ Chicken', 'Smoked Cheese', 'Onions'],
    prices: { S: 600, M: 1000, L: 1300 }, 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' 
  },
  
  // Burgers
  { 
    id: 'b1', 
    category: 'Burgers', 
    name: 'Zinger Burger', 
    description: 'Crispy chicken fillet with lettuce and mayo.',
    ingredients: ['Crispy Chicken', 'Lettuce', 'Mayo', 'Bun'],
    price: 300, 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'b2', 
    category: 'Burgers', 
    name: 'Zinger Cheese Burger', 
    description: 'Our classic zinger with a slice of melted cheese.',
    ingredients: ['Crispy Chicken', 'Cheese Slice', 'Lettuce', 'Mayo'],
    price: 350, 
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'b3', 
    category: 'Burgers', 
    name: 'Double Zinger Burger', 
    description: 'Two crispy fillets for double the crunch.',
    ingredients: ['2x Crispy Chicken', 'Lettuce', 'Mayo'],
    price: 450, 
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'b4', 
    category: 'Burgers', 
    name: 'Double Zinger Cheese Burger', 
    description: 'Double fillets with double cheese.',
    ingredients: ['2x Crispy Chicken', '2x Cheese', 'Lettuce', 'Mayo'],
    price: 500, 
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop' 
  },
  
  // Shawarmas
  { 
    id: 's1', 
    category: 'Shawarma', 
    name: 'Chicken Shawarma Large', 
    description: 'Large wrap with juicy chicken and garlic sauce.',
    ingredients: ['Pita Bread', 'Grilled Chicken', 'Garlic Sauce', 'Pickles'],
    price: 170, 
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 's2', 
    category: 'Shawarma', 
    name: 'Chicken Shawarma Small', 
    description: 'Small wrap perfect for a quick snack.',
    ingredients: ['Pita Bread', 'Grilled Chicken', 'Garlic Sauce'],
    price: 140, 
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 's3', 
    category: 'Shawarma', 
    name: 'Chicken Cheese Shawarma', 
    description: 'Classic shawarma with extra melted cheese.',
    ingredients: ['Pita Bread', 'Grilled Chicken', 'Cheese', 'Garlic Sauce'],
    price: 250, 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 's4', 
    category: 'Shawarma', 
    name: 'Zinger Shawarma', 
    description: 'Shawarma wrap with crispy zinger chicken.',
    ingredients: ['Pita Bread', 'Zinger Chicken', 'Mayo', 'Lettuce'],
    price: 300, 
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 's5', 
    category: 'Shawarma', 
    name: 'Zinger Cheese Shawarma', 
    description: 'Zinger shawarma with a cheesy twist.',
    ingredients: ['Pita Bread', 'Zinger Chicken', 'Cheese', 'Mayo'],
    price: 350, 
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop' 
  },
  
  // Deals
  { 
    id: 'd1', 
    category: 'Deals', 
    name: 'Deal 1', 
    description: 'Small Pizza + 1 Zinger + Drink', 
    ingredients: ['1 Small Pizza', '1 Zinger Burger', '1 Soft Drink'],
    price: 860, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd2', 
    category: 'Deals', 
    name: 'Deal 2', 
    description: 'Small Pizza + Shawarma + Drink', 
    ingredients: ['1 Small Pizza', '1 Chicken Shawarma', '1 Soft Drink'],
    price: 730, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd3', 
    category: 'Deals', 
    name: 'Deal 3', 
    description: 'Small Pizza + Fries + Drink', 
    ingredients: ['1 Small Pizza', '1 Regular Fries', '1 Soft Drink'],
    price: 660, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd5', 
    category: 'Deals', 
    name: 'Deal 5', 
    description: 'Medium Pizza + 1 Zinger + 2 Shawarma + 2 Drinks', 
    ingredients: ['1 Medium Pizza', '1 Zinger Burger', '2 Shawarmas', '2 Soft Drinks'],
    price: 2880, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd6', 
    category: 'Deals', 
    name: 'Deal 6', 
    description: '2 Large Pizza + 2 Zinger + 2 Shawarma + 1.5L Drink', 
    ingredients: ['2 Large Pizzas', '2 Zinger Burgers', '2 Shawarmas', '1.5L Soft Drink'],
    price: 3500, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd7', 
    category: 'Deals', 
    name: 'Deal 7', 
    description: '1 Medium Pizza + 2 Zinger + 1.5L Drink', 
    ingredients: ['1 Medium Pizza', '2 Zinger Burgers', '1.5L Soft Drink'],
    price: 1580, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd8', 
    category: 'Deals', 
    name: 'Deal 8', 
    description: '1 Large Pizza + 1 Zinger + 1.5L Drink', 
    ingredients: ['1 Large Pizza', '1 Zinger Burger', '1.5L Soft Drink'],
    price: 1680, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd9', 
    category: 'Deals', 
    name: 'Deal 9', 
    description: '5 Zinger + 1.5L Drink', 
    ingredients: ['5 Zinger Burgers', '1.5L Soft Drink'],
    price: 1680, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 'd10', 
    category: 'Deals', 
    name: 'Deal 10', 
    description: '5 Shawarma + 1.5L Drink', 
    ingredients: ['5 Shawarmas', '1.5L Soft Drink'],
    price: 1030, 
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop' 
  },
];
