// Icon Font Awesome 6 (qua react-icons/fa6) cho category + sub-category.
import type { IconType } from "react-icons";
import {
  FaCarSide,
  FaMotorcycle,
  FaCar,
  FaBus,
  FaPlane,
  FaUtensils,
  FaCow,
  FaDrumstickBite,
  FaCarrot,
  FaBolt,
  FaPlug,
  FaFire,
  FaDroplet,
  FaBagShopping,
  FaShirt,
  FaMobileScreen,
  FaCouch,
  FaLeaf,
} from "react-icons/fa6";

export const CATEGORY_ICONS: Record<string, IconType> = {
  // category
  Transport: FaCarSide,
  Food: FaUtensils,
  Energy: FaBolt,
  Shopping: FaBagShopping,
  // sub-category (khớp backend EmissionService)
  Motorbike: FaMotorcycle,
  Car: FaCar,
  Bus: FaBus,
  Plane: FaPlane,
  "Red Meat": FaCow,
  "White Meat": FaDrumstickBite,
  Vegetarian: FaCarrot,
  Electricity: FaPlug,
  Gas: FaFire,
  Water: FaDroplet,
  Clothing: FaShirt,
  Electronics: FaMobileScreen,
  Furniture: FaCouch,
};

/** Icon cho 1 category / sub-category (mặc định: chiếc lá). */
export const iconFor = (value: string): IconType => CATEGORY_ICONS[value] ?? FaLeaf;
