export type Category = "Transport" | "Food" | "Energy" | "Shopping";

export interface Activity {
  id: string;
  userId: string;
  date: string;      // "dd/MM/yyyy"
  activity: string;  // sub-category, vd "Car", "Red Meat"
  detail: string;    // vd "25 km"
  co2: number;       // kg CO2
  category: Category;
  status: "High" | "Low";
}

export interface NewActivity {
  category: Category;
  subCategory: string;
  amount: number;
}
