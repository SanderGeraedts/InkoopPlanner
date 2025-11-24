'use client';

import * as db from './index';
import { defaultProductsData } from '@/src/utils';
import { ProductCategory } from '@/src/types';

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
