import { Item } from '../../Interface/item.interface';

const productNames = [
  'Syltherine', 'Leviosa', 'Lolito', 'Respira', 'Grifo', 'Muggo', 'Pingky', 'Potty',
];

const productTypes = [
  'Stylish cafe chair', 'Luxury big sofa', 'Outdoor bar table and stool',
  'Minimalist lamp', 'Modern coffee table', 'Comfortable armchair',
  'Elegant dining set', 'Cozy bedroom set', 'Contemporary desk',
  'Vintage sideboard', 'Industrial bookshelf', 'Scandinavian sofa'
];

const descriptions = [
  'Stylish cafe chair', 'Luxury big sofa', 'Outdoor bar table and stool',
  'Minimalist lamp', 'Modern coffee table', 'Comfortable armchair',
  'Elegant dining set', 'Cozy bedroom set', 'Contemporary desk',
  'Vintage sideboard', 'Industrial bookshelf', 'Scandinavian sofa'
];

export async function mockApi(page: number, pageSize: number): Promise<Item[]> {

  const delay = Math.random() * 700 + 300;
  await new Promise(res => setTimeout(res, delay));

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const totalItems = 131; 

  const allItems: Item[] = Array.from({ length: totalItems }).map((_, i) => {
    const hasDiscount = Math.random() > 0.4; 
    const isNew = !hasDiscount && Math.random() > 0.7; 

    const basePrice = Math.floor(Math.random() * 14500) + 500;
    const discountPercent = hasDiscount ? [30, 50][Math.floor(Math.random() * 2)] : 0;
    const originalPrice = hasDiscount ? Math.floor(basePrice / (1 - discountPercent / 100)) : undefined;
    
    const nameIndex = i % productNames.length;
    const typeIndex = i % productTypes.length;
    
    return {
      id: i + 1,
      title: productNames[nameIndex],
      subtitle: productTypes[typeIndex],
      description: descriptions[typeIndex],
      price: basePrice,
      originalPrice,
      discount: hasDiscount ? discountPercent : undefined,
      isNew: isNew || undefined,
      image: `https://picsum.photos/400/400?random=${i + 1}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString()
    };
  });

  if (start >= totalItems) {
    return []; 
  }

  return allItems.slice(start, Math.min(end, totalItems));
}
