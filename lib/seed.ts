import * as db from './db';
import { ProductCategory } from './db';

export async function seedProducts() {
  // Check if products already exist
  const existingProducts = await db.getAllProducts();
  if (existingProducts.length > 0) {
    console.log('Products already seeded');
    return;
  }

  // Seed products
  const products: Array<Omit<db.Product, 'id'>> = [
    // Drinken
    { name: 'Thee (Fruit / Fusion)', category: ProductCategory.Drinken, image: null },
    { name: 'Thee (Rooibos)', category: ProductCategory.Drinken, image: null },
    { name: 'Thee (Sterrenmunt)', category: ProductCategory.Drinken, image: null },
    { name: 'Thee (Groene thee)', category: ProductCategory.Drinken, image: null },
    { name: 'Halfvolle melk', category: ProductCategory.Drinken, image: null },
    { name: 'Soja melk', category: ProductCategory.Drinken, image: null },
    { name: 'Magere drinkyoghurt', category: ProductCategory.Drinken, image: null },
    
    // Brood en beleg
    { name: 'Fijn volkorenbrood', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Spelt brood', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Grof volkorenbrood', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Tijger volkorenbrood', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Smeerboter', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Zuivelspread light', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Zuivelspread light met kruiden', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Cottage cheese / Hüttekäse', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Maza Hoemoes naturel', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: 'Eieren', category: ProductCategory.Brood_en_Beleg, image: null },
    { name: '100% pindakaas', category: ProductCategory.Brood_en_Beleg, image: null },
    
    // Tussendoor
    { name: 'Volkoren knäckebrod', category: ProductCategory.Tussendoor, image: null },
    { name: 'Volkoren crackers', category: ProductCategory.Tussendoor, image: null },
    { name: 'Volkomen mueslibrood', category: ProductCategory.Tussendoor, image: null },
    { name: 'Volkoren beschuit', category: ProductCategory.Tussendoor, image: null },
    { name: 'Kokosyoghurt', category: ProductCategory.Tussendoor, image: null },
    { name: 'Magere yoghurt', category: ProductCategory.Tussendoor, image: null },
    { name: 'Magere knakworstjes', category: ProductCategory.Tussendoor, image: null },
    { name: 'Mini crackers', category: ProductCategory.Tussendoor, image: null },
    { name: 'Maiswafels', category: ProductCategory.Tussendoor, image: null },
    { name: 'Soepstengels', category: ProductCategory.Tussendoor, image: null },
    
    // Aanvullend beperkt
    { name: 'Kipfilet', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Kipfilet tuinkruiden', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Kalkoenfilet', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Vega kipfilet', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Vega kalkoenham', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Appelstroop', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Vruchtenhagel', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Fruitspread', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Sandwichspread', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Vegan groentespread tomaat/zourgette', category: ProductCategory.Aanvullend_beperkt, image: null },
    { name: 'Vega paté', category: ProductCategory.Aanvullend_beperkt, image: null },
    
    // Groenten en fruit
    { name: 'Tomaten (voor soep)', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Uien', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Zoete aardappel', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Wortels', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Courgette', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Broccoli (diepvries)', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Bloemkool (diepvries)', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Diepvries aardbeien', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Diepvries rood fruit', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Diepvries mango', category: ProductCategory.Groenten_en_Fruit, image: null },
    { name: 'Diepvries frambozen', category: ProductCategory.Groenten_en_Fruit, image: null },
    
    // Overigen producten
    { name: 'Vuilniszakken', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Vaatwastablatten', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Bakpapier', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Aluminiumfolie', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Afwasmiddel', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Pedaalemmerzakken', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Allesreiniger', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Allesreinigerdoekjes', category: ProductCategory.Overigen_producten, image: null },
    { name: 'Bouillonblokjes', category: ProductCategory.Overigen_producten, image: null },
  ];

  for (const product of products) {
    await db.createProduct(product);
  }

  console.log(`Seeded ${products.length} products`);
}
