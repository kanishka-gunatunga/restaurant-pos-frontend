import type { MenuItem } from "./types";

function getProdImage(id: string) {
  const num = parseInt(id, 10);
  const imgNum = num <= 7 ? num : (num % 7) || 1;
  return `/prod/${imgNum}.png`;
}

export { getProdImage };

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Classic Beef Burger",
    category: "Burgers",
    subCategory: "Beef",
    price: 2500,
    addOns: [
      { id: "a1", name: "Extra Cheese", price: 250 },
      { id: "a2", name: "Bacon", price: 250 },
      { id: "a3", name: "Egg", price: 100 },
    ],
  },
  {
    id: "2",
    name: "Spicy Chicken Burger",
    category: "Burgers",
    subCategory: "Chicken",
    price: 2500,
    addOns: [
      { id: "a4", name: "Extra Cheese", price: 250 },
      { id: "a5", name: "Jalapeños", price: 150 },
    ],
  },
  {
    id: "3",
    name: "Veggie Deluxe Burger",
    category: "Burgers",
    subCategory: "Veggie",
    price: 2200,
  },
  {
    id: "4",
    name: "Fish Fillet Burger",
    category: "Burgers",
    subCategory: "Fish",
    price: 2600,
  },
  {
    id: "5",
    name: "Margherita Pizza",
    category: "Pizza",
    subCategory: "Cheese",
    price: 2500,
    variants: [
      { name: "Small", price: 2300 },
      { name: "Medium", price: 3250 },
      { name: "Large", price: 4250 },
    ],
    addOns: [
      { id: "a6", name: "Extra Pepperoni", price: 500 },
      { id: "a7", name: "Olives", price: 240 },
      { id: "a8", name: "Mushrooms", price: 300 },
    ],
  },
  {
    id: "6",
    name: "Pepperoni Pizza",
    category: "Pizza",
    subCategory: "Meat",
    price: 2500,
    variants: [
      { name: "Small", price: 2250 },
      { name: "Medium", price: 3250 },
      { name: "Large", price: 4250 },
    ],
    addOns: [
      { id: "a9", name: "Extra Pepperoni", price: 250 },
      { id: "a10", name: "Olives", price: 250 },
      { id: "a11", name: "Mushrooms", price: 250 },
    ],
  },
  {
    id: "7",
    name: "Garden Veggie Pizza",
    category: "Pizza",
    subCategory: "Veggie",
    price: 2300,
    variants: [
      { name: "Small", price: 2100 },
      { name: "Medium", price: 3000 },
      { name: "Large", price: 4000 },
    ],
  },
  {
    id: "8",
    name: "BBQ Special Pizza",
    category: "Pizza",
    subCategory: "Special",
    price: 2800,
    variants: [
      { name: "Small", price: 2600 },
      { name: "Medium", price: 3600 },
      { name: "Large", price: 4600 },
    ],
  },
  {
    id: "9",
    name: "Truffle Pasta",
    category: "Pasta",
    subCategory: "Cream",
    price: 2500,
  },
  {
    id: "10",
    name: "Seafood Linguine",
    category: "Pasta",
    subCategory: "Tomato",
    price: 2500,
  },
  {
    id: "11",
    name: "Shrimp Alfredo",
    category: "Pasta",
    subCategory: "Seafood",
    price: 2700,
  },
  {
    id: "12",
    name: "Pesto Veggie Pasta",
    category: "Pasta",
    subCategory: "Veggie",
    price: 2200,
  },
  {
    id: "13",
    name: "Fruit Cocktail",
    category: "Drinks",
    subCategory: "Cold",
    price: 2500,
  },
  {
    id: "14",
    name: "Iced Latte",
    category: "Drinks",
    subCategory: "Cold",
    price: 2500,
  },
  {
    id: "15",
    name: "Hot Chocolate",
    category: "Drinks",
    subCategory: "Hot",
    price: 1200,
  },
  {
    id: "16",
    name: "Mango Smoothie",
    category: "Drinks",
    subCategory: "Smoothies",
    price: 1800,
  },
  {
    id: "17",
    name: "Fresh Orange Juice",
    category: "Drinks",
    subCategory: "Juices",
    price: 900,
  },
  {
    id: "18",
    name: "Chocolate Brownie",
    category: "Dessert",
    subCategory: "Chocolate",
    price: 2500,
  },
  {
    id: "19",
    name: "Tiramisu",
    category: "Dessert",
    subCategory: "Chocolate",
    price: 2500,
  },
  {
    id: "20",
    name: "Fruit Salad",
    category: "Dessert",
    subCategory: "Fruit",
    price: 1500,
  },
  {
    id: "21",
    name: "Vanilla Ice Cream",
    category: "Dessert",
    subCategory: "Ice Cream",
    price: 800,
  },
  {
    id: "22",
    name: "Red Velvet Cake",
    category: "Dessert",
    subCategory: "Cake",
    price: 2000,
  },
];
