import { Order, OrderRow, ProductCategory } from '@/src/types';

export const days = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
export const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

// Map products to their list types (Dagopvang, BSO, and/or Stock)
export const productListTypes: Record<string, ('Dagopvang' | 'BSO' | 'Stock')[]> = {
  // Drinken - Common to both
  'Jumbo Halfvolle melk 1 liter': ['Dagopvang', 'BSO'],
  'Jumbo Karnemelk 1 liter': ['Dagopvang', 'BSO'],
  'Jumbo Houdbare Halfvolle melk 1 liter': ['Dagopvang', 'BSO'],
  'Jumbo Sojadrink naturel': ['Dagopvang', 'BSO'],
  'Jumbo Halfvolle yohurt 1 liter': ['Dagopvang', 'BSO'],
  'Jumbo milde halfvolle yohurt 1 liter': ['Dagopvang', 'BSO'],
  'Jumbo drinkyohurt framboos 0% vet': ['Dagopvang', 'BSO'],

  // Brood - Common to both
  'Jumbo bruinbrood en knapperig vers': ['Dagopvang', 'BSO'],
  'Jumbo volkoren beschuit': ['Dagopvang', 'BSO'],
  'Glutevrij brood': ['Dagopvang', 'BSO'],
  'Hollandia Matze Crackers': ['Dagopvang', 'BSO'],
  'Jumbo luchtige Crackers vezelrijk': ['Dagopvang', 'BSO'],
  'Brood van Soma Rozijnen Noten Bruin Rogge Tarwebrood 400 gram': ['Dagopvang', 'BSO'],
  'Jumbo knackebrood volkoren 375 gram': ['Dagopvang', 'BSO'],

  // Brood - Dagopvang only
  'Jumbo Rond Korn volkoren knapperig vers': ['Dagopvang'],
  'Jumbo Boeren pompoen volkoren- knapperig vers': ['Dagopvang'],
  'Jumbo Boeren Tijger Volkoren Knapperig vers': ['Dagopvang'],
  'Jumbo- Boeren Donker Volkoren Meergranen. Knapperig vers': ['Dagopvang'],

  // Brood - BSO only
  'Jumbo fijn volkoren knapperig vers': ['BSO'],
  'Jumbo Waldkorn volkoren meergranen brood': ['BSO'],
  'Jumbo Waldkorn meergranen': ['BSO'],
  'Jumbo Boeren pompoen volkoren- knapperig vers.': ['BSO'],

  // Beleg - Common to both
  'Jumbo Bewust Light 500 gram': ['Dagopvang', 'BSO'],
  'Cremette zuivelspread bieslook 200 gram': ['Dagopvang', 'BSO'],
  'Cremette zuivelspread naturel 200 gram': ['Dagopvang', 'BSO'],
  'Jumbo Kalkoenfilet 100 gram': ['Dagopvang', 'BSO'],
  'Kipfilet 175 gram': ['Dagopvang', 'BSO'],
  'Wahid Kalkoenham': ['Dagopvang', 'BSO'],
  'Kips vega pate 125 gram': ['Dagopvang', 'BSO'],
  'Jumbo Cottage cheese 200 gram': ['Dagopvang', 'BSO'],
  'Jumbo Hummus naturel': ['Dagopvang', 'BSO'],
  'Jumbo Hummus zongedroogde tomaat': ['Dagopvang', 'BSO'],
  'Jumbo Komkommersalade': ['Dagopvang', 'BSO'],
  'Jumbo 100% Pindakaas naturel 350 gram': ['Dagopvang', 'BSO'],
  'Jumbo 100% Pindakaas naturel 600 gram': ['Dagopvang', 'BSO'],
  'Jumbo 100% puur Noten-Pinda-Amandel-Cashew Pindakaas': ['Dagopvang', 'BSO'],
  'Jumbo aardbeien fruitspread': ['Dagopvang', 'BSO'],
  'Jumbo abrikoos fruitspread': ['Dagopvang', 'BSO'],
  'Jumbo bosvruchten fruitspread': ['Dagopvang', 'BSO'],
  'Canisius Fruitsiroop 100% appel 300 gram': ['Dagopvang', 'BSO'],
  'Jumbo vruchtenhagel': ['Dagopvang', 'BSO'],

  // Beleg - Dagopvang only
  'Zonnatura spread Paprika': ['Dagopvang'],
  'Zonnatura spread Advocado': ['Dagopvang'],
  'Zonnatura spread Mango': ['Dagopvang'],
  'Zonnatura spread Spinazie': ['Dagopvang'],

  // Beleg - BSO only
  'Jumbo hagelslag': ['BSO'],
  'Jumbo kaas plakken 30+': ['BSO'],
  'Jumbo light smeerkaas 30+': ['BSO'],
  'Jumbo geitenkaas': ['BSO'],
  'Jumbo geitensmeerkaas': ['BSO'],
  'Jumbo selderiesalade': ['BSO'],

  // Tussendoor - Common to both
  'Jumbo rijstwafel': ['Dagopvang', 'BSO'],
  'Jumbo rijstwafel meergranen': ['Dagopvang', 'BSO'],
  'Jumbo biologische maiswafels lijnzaad 150 gram': ['Dagopvang', 'BSO'],
  'Maria koekjes': ['BSO'],

  // Tussendoor - Dagopvang only
  'De Kleine Keuken biologische zachte koekjes gezoet met appelsap (6 mnd)': ['Dagopvang'],
  'Baby Maisvingers aardbei (6 mnd)': ['Dagopvang'],
  'Baby Maisvingers banaan (6 mnd)': ['Dagopvang'],
  'Baby Rijstwafels naturel (6 mnd)': ['Dagopvang'],
  'De Kleine Keuken speltkoekjes (8 mnd)': ['Dagopvang'],
  'De Kleine Keuken dadel appel reepjes (12 mnd)': ['Dagopvang'],
  'De Kleine Keuken granen reepjes gevuld met aardbei en appel (18 mnd)': ['Dagopvang'],

  // Tussendoor - BSO only
  'Jumbo ongebrande notenmix 500 gram': ['BSO'],
  'Jumbo notenmix ongezouten 200 gram': ['BSO'],
  'Jumbo zongedroogde Sultana rozijnen': ['BSO'],
  'Jumbo gedroogde abrikozen': ['BSO'],
  'Jumbo gedroogde pruimen': ['BSO'],
  'Jumbo popcorn mais': ['BSO'],
  'Jumbo lange vingers': ['BSO'],
  'Echte spekulaas': ['BSO'],

  // Groente en Overige - Common to both
  'Jumbo wortel tortilla': ['Dagopvang', 'BSO'],
  'Jumbo tomaat tortilla': ['Dagopvang', 'BSO'],
  'Jumbo gehakte spinazie 450 gram': ['Dagopvang', 'BSO'],
  'Jumbo broccoli roosjes 450 gram': ['Dagopvang', 'BSO'],
  'Jumbo bloemkool roosjes 450 gram': ['Dagopvang', 'BSO'],
  'Tomaten (voor soep)': ['Dagopvang', 'BSO'],
  'Uien': ['Dagopvang', 'BSO'],
  'Zoete aardappel': ['Dagopvang', 'BSO'],
  'Wortel': ['Dagopvang', 'BSO'],
  'Courgette': ['Dagopvang', 'BSO'],
  'Jumbo olijven zonder pit': ['Dagopvang', 'BSO'],
  'Jumbo doperwten 200 gram (pot)': ['Dagopvang', 'BSO'],
  'Jumbo wortel 680 gram (pot)': ['Dagopvang', 'BSO'],

  // Diepvries fruit en Ijs - Common to both
  'Jumbo vries verse blauwe bessen 250 gram': ['Dagopvang', 'BSO'],
  'Jumbo vries verse aardbeien 250 gram': ['Dagopvang', 'BSO'],
  'Jumbo vries verse aardbeien 750 gram': ['Dagopvang', 'BSO'],
  'Jumbo vries verse mango 750 gram': ['Dagopvang', 'BSO'],
  'Jumbo vries verse frambozen 750 gram': ['Dagopvang', 'BSO'],
  'Jumbo peren waterijs': ['Dagopvang', 'BSO'],
  'Jumbo mango waterijs': ['Dagopvang', 'BSO'],
  'Jumbo aardbeien waterijs': ['Dagopvang', 'BSO'],

  // Thee - Common to both (mostly)
  'Jumbo Rooibos original': ['Dagopvang', 'BSO'],
  'Jumbo Englese melange': ['Dagopvang', 'BSO'],
  'Jumbo Bosvruchtenthee': ['Dagopvang', 'BSO'],
  'Jumbo Citroenthee': ['Dagopvang', 'BSO'],
  'Jumbo Vruchtenthee variatie': ['Dagopvang', 'BSO'],
  'Kleine keuken biologische fruit en kruidenthee.': ['Dagopvang'],

  // Producten buiten voedingsbeleid - Common to both
  'Jumbo afwasmiddel': ['Dagopvang', 'BSO'],
  'Jumbo allesreiniger': ['Dagopvang', 'BSO'],
  'Jumbo allesreiniger doekjes citroen': ['Dagopvang', 'BSO'],
  'Jumbo kleur waspoeder': ['Dagopvang', 'BSO'],
  'Jumbo kleur vloeibaar': ['Dagopvang', 'BSO'],
  'Jumbo creamer sticks 50 stks': ['Dagopvang', 'BSO'],
  'Natreen zoetjes': ['Dagopvang', 'BSO'],
  'Afwasborstel': ['Dagopvang', 'BSO'],
  'Schuursponsjes': ['Dagopvang', 'BSO'],
  'Jumbo vuilniszakken 60 ltr': ['Dagopvang', 'BSO'],
  'Jumbo pedaalemmerzakken met handvat 20 ltr': ['Dagopvang', 'BSO'],
  'Jumbo boterhamzakjes met sluitstrip 120 stks': ['Dagopvang', 'BSO'],
  'Jumbo aluminiumfolie': ['Dagopvang', 'BSO'],
  'Jumbo vaatwascapsules all-in-one 25 stks': ['Dagopvang', 'BSO'],
  'Augurken': ['Dagopvang', 'BSO'],
  'Jumbo Lungo Dolce Gusto koffiecups 16 stuks': ['Dagopvang', 'BSO'],
  'Powerful Eggs Nederlandse scharreleieren 20 stks': ['Dagopvang', 'BSO'],
  'Jumbo bakpapier': ['Dagopvang', 'BSO'],
  'Jumbo plasticfolie': ['Dagopvang', 'BSO'],
  'Boullionblokjes': ['Dagopvang', 'BSO'],
  'Knakworstjes': ['Dagopvang'],
  'Jumbo kaasplakken 30+': ['Dagopvang'],
  'Jumbo smeerkaas 30+': ['Dagopvang'],
  'Soepstengels': ['BSO'],
};

// Default products data (from default-products.yaml)
// Combined products from both Dagopvang and BSO
export const defaultProductsData: Record<ProductCategory, string[]> = {
  'Drinken': [
    'Jumbo Halfvolle melk 1 liter',
    'Jumbo Karnemelk 1 liter',
    'Jumbo Houdbare Halfvolle melk 1 liter',
    'Jumbo Sojadrink naturel',
    'Jumbo Halfvolle yohurt 1 liter',
    'Jumbo milde halfvolle yohurt 1 liter',
    'Jumbo drinkyohurt framboos 0% vet',
  ],
  'Brood': [
    'Jumbo bruinbrood en knapperig vers',
    'Jumbo Rond Korn volkoren knapperig vers',
    'Jumbo Boeren pompoen volkoren- knapperig vers',
    'Jumbo Boeren Tijger Volkoren Knapperig vers',
    'Jumbo- Boeren Donker Volkoren Meergranen. Knapperig vers',
    'Jumbo knackebrood volkoren 375 gram',
    'Jumbo volkoren beschuit',
    'Brood van Soma Rozijnen Noten Bruin Rogge Tarwebrood 400 gram',
    'Hollandia Matze Crackers',
    'Jumbo luchtige Crackers vezelrijk',
    'Glutevrij brood',
    'Jumbo fijn volkoren knapperig vers',
    'Jumbo Waldkorn volkoren meergranen brood',
    'Jumbo Waldkorn meergranen',
    'Jumbo Boeren pompoen volkoren- knapperig vers.',
  ],
  'Beleg': [
    'Jumbo Bewust Light 500 gram',
    'Cremette zuivelspread bieslook 200 gram',
    'Cremette zuivelspread naturel 200 gram',
    'Jumbo Kalkoenfilet 100 gram',
    'Kipfilet 175 gram',
    'Wahid Kalkoenham',
    'Kips vega pate 125 gram',
    'Jumbo Cottage cheese 200 gram',
    'Jumbo Hummus naturel',
    'Jumbo Hummus zongedroogde tomaat',
    'Jumbo Komkommersalade',
    'Jumbo 100% Pindakaas naturel 350 gram',
    'Jumbo 100% Pindakaas naturel 600 gram',
    'Jumbo 100% puur Noten-Pinda-Amandel-Cashew Pindakaas',
    'Jumbo aardbeien fruitspread',
    'Jumbo abrikoos fruitspread',
    'Jumbo bosvruchten fruitspread',
    'Zonnatura spread Paprika',
    'Zonnatura spread Advocado',
    'Zonnatura spread Mango',
    'Zonnatura spread Spinazie',
    'Canisius Fruitsiroop 100% appel 300 gram',
    'Jumbo vruchtenhagel',
    'Jumbo hagelslag',
    'Jumbo kaas plakken 30+',
    'Jumbo light smeerkaas 30+',
    'Jumbo geitenkaas',
    'Jumbo geitensmeerkaas',
    'Jumbo selderiesalade',
  ],
  'Tussendoor': [
    'Jumbo rijstwafel',
    'Jumbo rijstwafel meergranen',
    'Jumbo biologische maiswafels lijnzaad 150 gram',
    'De Kleine Keuken biologische zachte koekjes gezoet met appelsap (6 mnd)',
    'Baby Maisvingers aardbei (6 mnd)',
    'Baby Maisvingers banaan (6 mnd)',
    'Baby Rijstwafels naturel (6 mnd)',
    'De Kleine Keuken speltkoekjes (8 mnd)',
    'De Kleine Keuken dadel appel reepjes (12 mnd)',
    'De Kleine Keuken granen reepjes gevuld met aardbei en appel (18 mnd)',
    'Jumbo ongebrande notenmix 500 gram',
    'Jumbo notenmix ongezouten 200 gram',
    'Jumbo zongedroogde Sultana rozijnen',
    'Jumbo gedroogde abrikozen',
    'Jumbo gedroogde pruimen',
    'Jumbo popcorn mais',
    'Maria koekjes',
    'Jumbo lange vingers',
    'Echte spekulaas',
  ],
  'Groente en Overige': [
    'Jumbo wortel tortilla',
    'Jumbo tomaat tortilla',
    'Jumbo gehakte spinazie 450 gram',
    'Jumbo broccoli roosjes 450 gram',
    'Jumbo bloemkool roosjes 450 gram',
    'Tomaten (voor soep)',
    'Uien',
    'Zoete aardappel',
    'Wortel',
    'Courgette',
    'Jumbo olijven zonder pit',
    'Jumbo doperwten 200 gram (pot)',
    'Jumbo wortel 680 gram (pot)',
  ],
  'Diepvries fruit en Ijs': [
    'Jumbo vries verse blauwe bessen 250 gram',
    'Jumbo vries verse aardbeien 250 gram',
    'Jumbo vries verse aardbeien 750 gram',
    'Jumbo vries verse mango 750 gram',
    'Jumbo vries verse frambozen 750 gram',
    'Jumbo peren waterijs',
    'Jumbo mango waterijs',
    'Jumbo aardbeien waterijs',
  ],
  'Thee': [
    'Jumbo Rooibos original',
    'Jumbo Englese melange',
    'Jumbo Bosvruchtenthee',
    'Jumbo Citroenthee',
    'Jumbo Vruchtenthee variatie',
    'Kleine keuken biologische fruit en kruidenthee.',
  ],
  'Producten buiten voedingsbeleid': [
    'Jumbo afwasmiddel',
    'Jumbo allesreiniger',
    'Jumbo allesreiniger doekjes citroen',
    'Jumbo kleur waspoeder',
    'Jumbo kleur vloeibaar',
    'Jumbo creamer sticks 50 stks',
    'Natreen zoetjes',
    'Afwasborstel',
    'Schuursponsjes',
    'Jumbo vuilniszakken 60 ltr',
    'Jumbo pedaalemmerzakken met handvat 20 ltr',
    'Jumbo boterhamzakjes met sluitstrip 120 stks',
    'Jumbo aluminiumfolie',
    'Jumbo vaatwascapsules all-in-one 25 stks',
    'Augurken',
    'Jumbo Lungo Dolce Gusto koffiecups 16 stuks',
    'Powerful Eggs Nederlandse scharreleieren 20 stks',
    'Jumbo bakpapier',
    'Jumbo plasticfolie',
    'Boullionblokjes',
    'Knakworstjes',
    'Maria koekjes',
    'Jumbo kaasplakken 30+',
    'Jumbo smeerkaas 30+',
    'Soepstengels',
  ],
  "Extra's": [],
};

// Product order is the same as defaultProductsData
export const productOrder: Record<ProductCategory, string[]> = defaultProductsData;

// Map category enum to display names
export const categoryDisplayNames: Record<ProductCategory, string> = {
  'Drinken': 'Drinken',
  'Brood': 'Brood',
  'Beleg': 'Beleg',
  'Tussendoor': 'Tussendoor',
  'Groente en Overige': 'Groente en Overige',
  'Diepvries fruit en Ijs': 'Diepvries fruit en Ijs',
  'Thee': 'Thee',
  'Producten buiten voedingsbeleid': 'Producten buiten voedingsbeleid',
  "Extra's": "Extra's",
};

// Define category order
export const categoryOrder: ProductCategory[] = [
  'Drinken',
  'Brood',
  'Beleg',
  'Tussendoor',
  'Groente en Overige',
  'Diepvries fruit en Ijs',
  'Thee',
  'Producten buiten voedingsbeleid',
  "Extra's",
];

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

// Get all OrderRows from an Order with inStock quantities subtracted
export const getAllOrderRowsWithStock = (order: Order): OrderRow[] => {
  // Get all order rows aggregated
  const allRows = getAllOrderRows(order);
  
  // If no inStock, return all rows as is
  if (!order.inStock || !order.inStock.orderRows) {
    return allRows;
  }
  
  // Create a map of inStock quantities by product ID
  const inStockMap = new Map<string, number>();
  order.inStock.orderRows.forEach(row => {
    inStockMap.set(row.product.id, row.quantity);
  });
  
  // Subtract inStock quantities from all rows
  return allRows.map(row => {
    const inStockQty = inStockMap.get(row.product.id) || 0;
    const adjustedQuantity = Math.max(0, row.quantity - inStockQty);
    
    return {
      ...row,
      quantity: adjustedQuantity,
    };
  }).filter(row => row.quantity > 0); // Only return rows with quantity > 0
}