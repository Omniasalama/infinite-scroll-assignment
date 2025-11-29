export interface Item {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  isNew?: boolean;
  createdAt: string;
}