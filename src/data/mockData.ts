export interface Juice {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
}

export interface VendingMachineState {
  juices: Juice[];
  totalMoney: number;
  insertedMoney: number;
}

export const initialJuices: Juice[] = [
  {
    id: 1,
    name: "น้ำส้ม",
    price: 25,
    stock: 10,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "น้ำแอปเปิล",
    price: 30,
    stock: 8,
    image: "https://images.unsplash.com/photo-1619546952812-520e98064a52?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    name: "น้ำองุ่น",
    price: 35,
    stock: 5,
    image: "https://images.unsplash.com/photo-1613478223719-2b1c2b3f3c3e?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "น้ำโค๊ก",
    price: 19,
    stock: 5,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 5,
    name: "น้ำแป๊ปซี่",
    price: 20,
    stock: 20,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 6,
    name: "น้ำสไปส์",
    price: 22,
    stock: 15,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60",
  }
];

export const initialVendingMachineState: VendingMachineState = {
  juices: initialJuices,
  totalMoney: 0,
  insertedMoney: 0
}; 