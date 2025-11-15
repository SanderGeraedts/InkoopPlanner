'use client';

import { OrderRow, ProductCategory } from '@/src/types';
import Accordion from './Accordion';

// Map category enum to display names
const categoryDisplayNames: Record<ProductCategory, string> = {
  'Drinken': 'Drinken',
  'Brood en Beleg': 'Brood en Beleg',
  'Tussendoor': 'Tussendoor',
  'Aanvullend beperkt': 'Aanvullend beperkt',
  'Groenten en Fruit': 'Groenten en Fruit',
  'Overigen producten': 'Overigen producten',
  "Extra's": "Extra's",
};

// Define category order
const categoryOrder: ProductCategory[] = [
  'Drinken',
  'Brood en Beleg',
  'Tussendoor',
  'Aanvullend beperkt',
  'Groenten en Fruit',
  'Overigen producten',
  "Extra's",
];

// Product order as defined in default-products.yaml
const productOrder: Record<ProductCategory, string[]> = {
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

export default function OrderRowsSummary({ orderRows }: { orderRows: OrderRow[] }) {
  // Group order rows by category
  const rowsByCategory = orderRows.reduce((acc, row) => {
    const category = row.product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(row);
    return acc;
  }, {} as Record<ProductCategory, OrderRow[]>);

  // Sort products within each category according to productOrder
  const sortedRowsByCategory: Record<ProductCategory, OrderRow[]> = {} as any;
  
  Object.keys(rowsByCategory).forEach((category) => {
    const cat = category as ProductCategory;
    const rows = rowsByCategory[cat];
    const order = productOrder[cat] || [];
    
    // Sort rows based on the order in productOrder
    sortedRowsByCategory[cat] = rows.sort((a, b) => {
      const indexA = order.indexOf(a.product.name);
      const indexB = order.indexOf(b.product.name);
      
      // If both products are in the order list, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one is in the order list, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the order list, sort alphabetically
      return a.product.name.localeCompare(b.product.name);
    });
  });

  return (
    <div className="w-full space-y-6">
      
      {categoryOrder.map((category) => {
        const categoryRows = sortedRowsByCategory[category] || [];
        
        if (categoryRows.length === 0) {
          return null;
        }
        
        return (
          <Accordion
            defaultOpen={true}
            key={category}
            title={categoryDisplayNames[category]}
            className="mb-4"
            variant='primary'
          >
            <ul className="space-y-2 mt-4">
              {categoryRows.map((row) => (
                <li
                  key={row.id}
                  className="flex items-center justify-between py-2 px-4 bg-beige rounded-md"
                >
                  <span className="text-foreground">{row.product.name}</span>
                  <span className="font-bold text-purple text-lg">{row.quantity}x</span>
                </li>
              ))}
            </ul>
          </Accordion>
        );
      })}
      
      {orderRows.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-lg text-foreground/60">Geen producten toegevoegd aan deze bestelling</p>
        </div>
      )}
    </div>
  );
}
