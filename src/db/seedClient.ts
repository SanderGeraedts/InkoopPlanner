'use client';

import * as db from './index';
import { ProductCategory } from '@/src/types';

// Default products data (from default-products.yaml)
const defaultProductsData: Record<ProductCategory, string[]> = {
  'Drinken': [
    'Thee (Fruit / Fusion)',
    'Thee (Rooibos)',
    'Thee (Sterrenmunt)',
    'Thee (Groene thee)',
    'Halfvolle melk',
    'Soja melk',
    'Magere drinkyoghurt',
  ],
  'Brood en Beleg': [
    'Fijn volkorenbrood',
    'Spelt brood',
    'Grof volkorenbrood',
    'Tijger volkorenbrood',
    'Smeerboter',
    'Zuivelspread light',
    'Zuivelspread light met kruiden',
    'Cottage cheese / Hüttekäse',
    'Maza Hoemoes naturel',
    'Eieren',
    '100% pindakaas',
  ],
  'Tussendoor': [
    'Volkoren knäckebrod',
    'Volkoren crackers',
    'Volkomen mueslibrood',
    'Volkoren beschuit',
    'Kokosyoghurt',
    'Magere yoghurt',
    'Magere knakworstjes',
    'Mini crackers',
    'Maiswafels',
    'Soepstengels',
  ],
  'Aanvullend beperkt': [
    'Kipfilet',
    'Kipfilet tuinkruiden',
    'Kalkoenfilet',
    'Vega kipfilet',
    'Vega kalkoenham',
    'Appelstroop',
    'Vruchtenhagel',
    'Fruitspread',
    'Sandwichspread',
    'Vegan groentespread tomaat/zourgette',
    'Vega paté',
    'Smeerkaas 20+',
    'Komkommersalade',
    'Zonnatura mango-curry spread',
    'Zonnatura avocado spread',
    'Kaas',
  ],
  'Groenten en Fruit': [
    'Tomaten (voor soep)',
    'Uien',
    'Zoete aardappel',
    'Wortels',
    'Courgette',
    'Broccoli (diepvries)',
    'Bloemkool (diepvries)',
    'Diepvries aardbeien',
    'Diepvries rood fruit',
    'Diepvries mango',
    'Diepvries frambozen',
    'Boontjes (diepvries)',
    'Augurken',
    'Aardappels',
    'Knoflook',
  ],
  'Overigen producten': [
    'Vuilniszakken',
    'Vaatwastablatten',
    'Bakpapier',
    'Aluminiumfolie',
    'Afwasmiddel',
    'Pedaalemmerzakken',
    'Allesreiniger',
    'Allesreinigerdoekjes',
    'Bouillonblokjes',
  ],
  "Extra's": [],
};

export async function seedProducts() {
  // Check if products already exist
  const existingProducts = await db.getAllProducts();
  if (existingProducts.length > 0) {
    console.log('Products already seeded, skipping...');
    return;
  }

  let totalProducts = 0;

  // Iterate through each category
  for (const [category, products] of Object.entries(defaultProductsData)) {
    // Create each product
    for (const productName of products) {
      await db.createProduct({
        id: db.generateId(),
        name: productName,
        category: category as ProductCategory,
      });
      totalProducts++;
    }
  }

  console.log(`Successfully seeded ${totalProducts} products across ${Object.keys(defaultProductsData).length} categories`);
}

// Optionally export a function to clear and reseed
export async function reseedProducts() {
  const existingProducts = await db.getAllProducts();
  
  // Delete all existing products
  for (const product of existingProducts) {
    await db.deleteProduct(product.id);
  }

  // Seed new products
  await seedProducts();
}
