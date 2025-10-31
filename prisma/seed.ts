import { PrismaClient, ProductCategory } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Map YAML category names to Prisma enum values
const categoryMap: Record<string, ProductCategory> = {
  'Drinken': 'Drinken',
  'Brood en beleg': 'Brood_en_Beleg',
  'Tussendoor': 'Tussendoor',
  'Aanvullend beperkt': 'Aanvullend_beperkt',
  'Groenten en fruit': 'Groenten_en_Fruit',
  'Overigen producten': 'Overigen_producten',
  'Extras': 'Extras',
};

interface Product {
  name: string;
  category: ProductCategory;
}

function parseYAMLFile(filePath: string): Product[] {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lines = fileContents.split('\n');
  const products: Product[] = [];
  
  let currentCategory: ProductCategory | null = null;
  let currentMainItem: string | null = null;
  let subItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      continue;
    }

    // Check if this is a category header (no leading dash, ends with colon)
    if (!trimmed.startsWith('-') && trimmed.endsWith(':')) {
      // Process previous main item before switching category
      if (currentMainItem && currentCategory) {
        if (subItems.length > 0) {
          for (const subItem of subItems) {
            products.push({
              name: `${currentMainItem} (${subItem.trim()})`,
              category: currentCategory,
            });
          }
        } else {
          products.push({
            name: currentMainItem.trim(),
            category: currentCategory,
          });
        }
      }

      // Set new category
      const categoryName = trimmed.slice(0, -1); // Remove trailing colon
      currentCategory = categoryMap[categoryName] || null;
      currentMainItem = null;
      subItems = [];
      continue;
    }

    if (!currentCategory) {
      continue;
    }

    // Check if this is a main item (starts with "-" and has 0-2 leading spaces)
    // Sub-items have more than 2 leading spaces
    const leadingSpaces = line.match(/^ */)?.[0].length || 0;
    const isMainItem = trimmed.startsWith('-') && leadingSpaces <= 2;
    const isSubItem = trimmed.startsWith('-') && leadingSpaces > 2;

    if (isMainItem) {
      // Process previous main item with sub-items if any
      if (currentMainItem && subItems.length > 0) {
        for (const subItem of subItems) {
          products.push({
            name: `${currentMainItem} (${subItem.trim()})`,
            category: currentCategory,
          });
        }
        subItems = [];
      } else if (currentMainItem && subItems.length === 0) {
        // Previous main item had no sub-items, add it as a regular product
        products.push({
          name: currentMainItem.trim(),
          category: currentCategory,
        });
      }

      // Set new main item
      currentMainItem = trimmed.slice(1).trim(); // Remove leading "-"
      subItems = [];
    } else if (isSubItem && currentMainItem) {
      // This is a sub-item of the current main item
      const subItem = trimmed.slice(1).trim(); // Remove leading "-"
      subItems.push(subItem);
    }
  }

  // Process the last item
  if (currentMainItem && currentCategory) {
    if (subItems.length > 0) {
      for (const subItem of subItems) {
        products.push({
          name: `${currentMainItem} (${subItem.trim()})`,
          category: currentCategory,
        });
      }
    } else {
      products.push({
        name: currentMainItem.trim(),
        category: currentCategory,
      });
    }
  }

  return products;
}

async function seedProducts() {
  try {
    // Clear existing products
    console.log('Clearing existing products...');
    await prisma.product.deleteMany();

    // Parse YAML file
    const yamlPath = path.join(process.cwd(), 'default-products.yaml');
    const products = parseYAMLFile(yamlPath);

    // Insert all products
    console.log(`Inserting ${products.length} products...`);
    await prisma.product.createMany({
      data: products,
    });

    console.log(`Successfully seeded ${products.length} products!`);
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

