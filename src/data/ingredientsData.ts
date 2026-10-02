import { IngredientSafetyInfo } from '../types/food';

export const INGREDIENT_DATABASE: Record<string, IngredientSafetyInfo> = {
  'palm oil': {
    name: 'Palm Oil / Palmolein',
    category: 'Vegetable Fat',
    purpose: 'Deep frying medium and cheap texture stabilizer for shelf stability.',
    safety: 'risky',
    description: 'High in palmitic saturated fat (~50%). Linked to arterial plaque accumulation, child digestive sluggishness, and increased LDL cholesterol.',
  },
  'tartrazine': {
    name: 'Tartrazine (E102 / Yellow 5)',
    category: 'Artificial Food Dye',
    purpose: 'Provides intense bright yellow coloration to chips, candies, and instant noodles.',
    safety: 'risky',
    description: 'Azo dye subject to mandatory warnings in the EU regarding adverse hyperactivity, restlessness, and attention deficit in young children.',
  },
  'sunset yellow': {
    name: 'Sunset Yellow (E110 / Yellow 6)',
    category: 'Artificial Food Dye',
    purpose: 'Adds bright orange-golden hue to extruded snacks and confectionery.',
    safety: 'risky',
    description: 'Synthetic azo dye associated with histamine release, allergies, and pediatric behavioral disruption.',
  },
  'monosodium glutamate': {
    name: 'Monosodium Glutamate (MSG / E621)',
    category: 'Flavor Enhancer',
    purpose: 'Provides intense savory umami flavor to snacks and soups.',
    safety: 'moderate',
    description: 'Generally recognized as safe in moderation, but hyper-palatable nature can trigger overeating and headaches in sensitive individuals.',
  },
  'disodium 5-ribonucleotides': {
    name: 'Disodium 5-ribonucleotides (E635)',
    category: 'Flavor Enhancer',
    purpose: 'Synergistic flavor multiplier used in instant noodle taste-maker packets.',
    safety: 'moderate',
    description: 'Creates hyper-craveable taste. May trigger skin itchiness or gut irritation in children with purine sensitivity.',
  },
  'high fructose syrup': {
    name: 'High Fructose Corn Syrup / Invert Sugar',
    category: 'Sweetener',
    purpose: 'Cheap concentrated liquid sweetener providing rapid sweetness and moisture retention.',
    safety: 'risky',
    description: 'Metabolized almost entirely by the liver into triglycerides. Spikes blood glucose quickly and accelerates tooth enamel decay.',
  },
  'hydrogenated vegetable fat': {
    name: 'Hydrogenated Vegetable Fat (Vanaspati)',
    category: 'Trans Fat / Fat',
    purpose: 'Hardens oils to create creamy biscuit fillings and extend shelf life.',
    safety: 'risky',
    description: 'Contains artificial trans fatty acids. Most harmful fat class for cardiovascular health, promoting systemic inflammation.',
  },
  'caffeine': {
    name: 'Caffeine',
    category: 'Stimulant',
    purpose: 'Adds characteristic bitterness and stimulating central nervous system alertness.',
    safety: 'risky',
    description: 'Health authorities strictly advise 0mg caffeine for children under 12. Induces elevated heart rates, anxiety, and bedtime insomnia.',
  },
  'soy lecithin': {
    name: 'Soy Lecithin (E322)',
    category: 'Emulsifier',
    purpose: 'Prevents cocoa butter and water separation in chocolates and baked goods.',
    safety: 'safe',
    description: 'Naturally derived phospholipid from soybeans. Very safe and aids fat digestion, unless allergic to soy.',
  },
  'beta-glucan': {
    name: 'Oat Beta-Glucan',
    category: 'Soluble Dietary Fiber',
    purpose: 'Natural whole grain soluble fiber found in oats.',
    safety: 'safe',
    description: 'Super healthy prebiotic fiber. Helps regulate blood glucose, lowers LDL cholesterol, and feeds beneficial gut microbiome.',
  },
  'calcium': {
    name: 'Calcium & Dairy Minerals',
    category: 'Essential Mineral',
    purpose: 'Essential micronutrient naturally rich in milk, paneer, and fortified grains.',
    safety: 'safe',
    description: 'Crucial for strong bones, healthy teeth enamel mineralization, and muscle contractions in growing children.',
  },
  'whey protein': {
    name: 'Whey Protein Isolate',
    category: 'Protein',
    purpose: 'Concentrated complete dairy protein containing all essential amino acids.',
    safety: 'safe',
    description: 'High biological value protein for muscle synthesis and cell repair. Portion control advised for small children.',
  },
  'cocoa mass': {
    name: 'Cocoa Mass / Cocoa Solids',
    category: 'Natural Flavor & Antioxidant',
    purpose: 'Pure ground cocoa beans providing rich chocolate flavor.',
    safety: 'safe',
    description: 'Rich in protective polyphenols and flavonoids that support cardiovascular health when not masked by excessive sugar.',
  },
  'pectin': {
    name: 'Fruit Pectin',
    category: 'Dietary Fiber / Gelling Agent',
    purpose: 'Soluble natural fiber found in fruit cell walls like apples and citrus.',
    safety: 'safe',
    description: 'Gentle on digestion, slows gastric emptying for sustained satiety, and promotes healthy colon bacteria.',
  },
  'caramel color iv': {
    name: 'Caramel Color IV (E150d / Sulfite Ammonia)',
    category: 'Food Colorant',
    purpose: 'Provides deep dark brown color to colas, dark biscuits, and gravies.',
    safety: 'moderate',
    description: 'Produced using ammonia and sulfites. While approved, high exposure to 4-MEI processing byproduct is monitored by health agencies.',
  },
  'phosphoric acid': {
    name: 'Phosphoric Acid (E338)',
    category: 'Acidulant',
    purpose: 'Adds sharp tang and prevents bacterial growth in dark colas.',
    safety: 'risky',
    description: 'Highly acidic (pH ~2.5). Demineralizes tooth enamel within 15 minutes and can leach calcium from developing bones.',
  },
};

export function lookupIngredient(name: string): IngredientSafetyInfo {
  const normalized = name.toLowerCase().trim();
  for (const [key, value] of Object.entries(INGREDIENT_DATABASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  // Default heuristic fallback
  const isLikelyRisky = normalized.includes('syrup') || normalized.includes('dye') || normalized.includes('hydrogenated') || normalized.includes('preservative');
  return {
    name: name,
    category: 'Packaged Food Component',
    purpose: 'Constituent ingredient used in formulation.',
    safety: isLikelyRisky ? 'moderate' : 'safe',
    description: isLikelyRisky 
      ? 'Ultra-processed component. Moderate your child’s exposure.' 
      : 'Standard food component evaluated within permissible dietary thresholds.',
  };
}
