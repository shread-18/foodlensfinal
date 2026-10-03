import { OFFICIAL_HACKATHON_DATASET } from '../data/foodDataset';
import { FoodItem } from '../types/food';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

export function getFoodFromDataset(productName: string): FoodItem | null {
  const query = normalize(productName);

  if (!query) {
    return null;
  }

  // 1. Exact match: product name, brand, barcode
  const exactMatch = OFFICIAL_HACKATHON_DATASET.find((food) =>
    [food.name, food.brand, food.barcode].some(
      (value) => value && normalize(String(value)) === query
    )
  );

  if (exactMatch) {
    return exactMatch;
  }

  // 2. Product name contains the search
  const nameMatch = OFFICIAL_HACKATHON_DATASET.find((food) =>
    normalize(food.name).includes(query)
  );

  if (nameMatch) {
    return nameMatch;
  }

  // 3. Search contains complete product name
  const reverseNameMatch = OFFICIAL_HACKATHON_DATASET.find((food) =>
    query.includes(normalize(food.name))
  );

  if (reverseNameMatch) {
    return reverseNameMatch;
  }

  // 4. Brand match
  const brandMatch = OFFICIAL_HACKATHON_DATASET.find((food) =>
    normalize(food.brand).includes(query)
  );

  if (brandMatch) {
    return brandMatch;
  }

  // 5. Category match
  const categoryMatch = OFFICIAL_HACKATHON_DATASET.find((food) =>
    normalize(food.category).includes(query)
  );

  if (categoryMatch) {
    return categoryMatch;
  }

  // 6. Token-based fuzzy search
  const queryWords = productName
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= 3);

  if (queryWords.length > 0) {
    const fuzzyMatch = OFFICIAL_HACKATHON_DATASET.find((food) => {
      const searchableText = [
        food.name,
        food.brand,
        food.category,
      ]
        .join(' ')
        .toLowerCase();

      return queryWords.some((word) =>
        searchableText.includes(word)
      );
    });

    if (fuzzyMatch) {
      return fuzzyMatch;
    }
  }

  return null;
}