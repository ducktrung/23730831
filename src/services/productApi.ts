import {
  PRICE_MULTIPLIER,
} from '@constants/student';

export type CategoryId =
  | 'all'
  | 'food'
  | 'drink'
  | 'study';

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;

  categoryId:
    Exclude<CategoryId, 'all'>;

  categoryLabel: string;
};

type ApiProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

function mapCategory(
  category: string,
): {
  id: Exclude<
    CategoryId,
    'all'
  >;
  label: string;
} {
  const value =
    category.toLowerCase();

  if (
    value.includes('clothing')
  ) {
    return {
      id: 'study',
      label: 'Học tập',
    };
  }

  if (
    value.includes('jewel')
  ) {
    return {
      id: 'drink',
      label: 'Nước',
    };
  }

  return {
    id: 'food',
    label: 'Đồ ăn',
  };
}

export async function fetchProducts():
Promise<Product[]> {
  const response =
    await fetch(
      'https://fakestoreapi.com/products?limit=8',
    );

  if (!response.ok) {
    throw new Error(
      `HTTP error: ${response.status}`,
    );
  }

  const data: ApiProduct[] =
    await response.json();

  return data.map(item => {
    const category =
      mapCategory(
        item.category,
      );

    return {
      id: item.id,

      title: item.title,

      price: Math.round(
        item.price *
          PRICE_MULTIPLIER,
      ),

      image: item.image,

      description:
        item.description,

      categoryId:
        category.id,

      categoryLabel:
        category.label,
    };
  });
}