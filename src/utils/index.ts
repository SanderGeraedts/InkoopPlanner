import { Order, OrderRow, ProductCategory } from '@/src/types';

export const days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
export const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

// Product order as defined in default-products.yaml
export const productOrder: Record<ProductCategory, string[]> = {
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

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayName = days[dateObj.getDay()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthName = months[dateObj.getMonth()];
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${dayName} ${day} ${monthName} '${year}`;
}

// Get all OrderRows from an Order
export const getAllOrderRows = (order: Order): OrderRow[] => {
  // Create a map to aggregate quantities by product ID
  const productMap = new Map<string, OrderRow>();

  // Iterate through all order lists
  order.orderLists.forEach(orderList => {
    // Iterate through all order rows in the list
    orderList.orderRows.forEach(orderRow => {
      const existingRow = productMap.get(orderRow.product.id);
      
      if (existingRow) {
        // Product already exists, add the quantity
        existingRow.quantity += orderRow.quantity;
      } else {
        // New product, add to map with a copy of the order row
        productMap.set(orderRow.product.id, {
            id: orderRow.id,
            product: orderRow.product,
            quantity: orderRow.quantity,
        });
      }
    });
  });

  // Convert map values to array
  return Array.from(productMap.values());
}