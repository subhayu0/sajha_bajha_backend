const { Product } = require('../../models');

const sampleProducts = [
  {
    name: 'Yamaha F310 Acoustic Guitar',
    description: 'A classic acoustic guitar perfect for beginners and intermediate players. Features a spruce top and mahogany back and sides for rich, warm tones.',
    price: 8999,
    originalPrice: 10999,
    category: 'guitar',
    brand: 'Yamaha',
    model: 'F310',
    stockQuantity: 15,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800'
    ],
    specifications: {
      'Body Type': 'Dreadnought',
      'Top Wood': 'Spruce',
      'Back & Sides': 'Mahogany',
      'Neck': 'Nato',
      'Fingerboard': 'Rosewood',
      'Strings': '6'
    },
    isFeatured: true,
    rating: 4.5,
    reviewCount: 127,
    sku: 'SB-GUITAR-YAMAHA-F310'
  },
  {
    name: 'Casio CT-S200 Digital Piano',
    description: 'Compact and portable digital piano with 61 keys, perfect for learning and practice. Features 400 tones and 77 rhythms.',
    price: 12999,
    originalPrice: 15999,
    category: 'piano',
    brand: 'Casio',
    model: 'CT-S200',
    stockQuantity: 8,
    images: [
      'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
      'https://images.unsplash.com/photo-1552423314-cf29d3c2c5b7?w=800'
    ],
    specifications: {
      'Keys': '61',
      'Polyphony': '48 notes',
      'Tones': '400',
      'Rhythms': '77',
      'Weight': '3.9 kg',
      'Power': 'Battery/AC Adapter'
    },
    isFeatured: true,
    rating: 4.3,
    reviewCount: 89,
    sku: 'SB-PIANO-CASIO-CT-S200'
  },
  {
    name: 'Pearl Export Drum Kit',
    description: 'Complete 5-piece drum kit with hardware and cymbals. Perfect for beginners and intermediate drummers.',
    price: 24999,
    originalPrice: 29999,
    category: 'drums',
    brand: 'Pearl',
    model: 'Export',
    stockQuantity: 5,
    images: [
      'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
      'https://images.unsplash.com/photo-1516307964725-815d34eb1d17?w=800'
    ],
    specifications: {
      'Configuration': '5-piece',
      'Shell Material': 'Poplar',
      'Bass Drum': '22" x 18"',
      'Snare': '14" x 5.5"',
      'Toms': '12", 13", 16"',
      'Includes': 'Hardware & Cymbals'
    },
    isFeatured: false,
    rating: 4.7,
    reviewCount: 156,
    sku: 'SB-DRUMS-PEARL-EXPORT'
  },
  {
    name: 'Yamaha YVN104 Violin',
    description: 'Student violin with solid spruce top and maple back. Includes bow, case, and rosin.',
    price: 15999,
    originalPrice: 18999,
    category: 'violin',
    brand: 'Yamaha',
    model: 'YVN104',
    stockQuantity: 12,
    images: [
      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800',
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'
    ],
    specifications: {
      'Size': '4/4',
      'Top': 'Solid Spruce',
      'Back & Sides': 'Maple',
      'Neck': 'Maple',
      'Fingerboard': 'Ebony',
      'Includes': 'Bow, Case, Rosin'
    },
    isFeatured: true,
    rating: 4.4,
    reviewCount: 203,
    sku: 'SB-VIOLIN-YAMAHA-YVN104'
  },
  {
    name: 'Hohner Student Flute',
    description: 'Nickel-plated student flute with closed-hole keys. Perfect for beginners learning to play.',
    price: 8999,
    originalPrice: 11999,
    category: 'flute',
    brand: 'Hohner',
    model: 'Student',
    stockQuantity: 20,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800'
    ],
    specifications: {
      'Material': 'Nickel-plated',
      'Keys': 'Closed-hole',
      'Footjoint': 'C',
      'Case': 'Included',
      'Cleaning Rod': 'Included',
      'Cloth': 'Included'
    },
    isFeatured: false,
    rating: 4.2,
    reviewCount: 67,
    sku: 'SB-FLUTE-HOHNER-STUDENT'
  },
  {
    name: 'Yamaha YAS-280 Saxophone',
    description: 'Alto saxophone with high F# key and adjustable thumb rest. Ideal for students and intermediate players.',
    price: 45999,
    originalPrice: 52999,
    category: 'saxophone',
    brand: 'Yamaha',
    model: 'YAS-280',
    stockQuantity: 6,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800'
    ],
    specifications: {
      'Type': 'Alto',
      'Key': 'Eb',
      'Material': 'Brass',
      'Finish': 'Lacquer',
      'High F#': 'Yes',
      'Thumb Rest': 'Adjustable'
    },
    isFeatured: true,
    rating: 4.8,
    reviewCount: 134,
    sku: 'SB-SAXOPHONE-YAMAHA-YAS-280'
  },
  {
    name: 'Hindustan Harmonium',
    description: 'Traditional Indian harmonium with 3.5 octaves. Perfect for classical Indian music and bhajans.',
    price: 12999,
    originalPrice: 15999,
    category: 'harmonium',
    brand: 'Hindustan',
    model: 'Classic',
    stockQuantity: 10,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800'
    ],
    specifications: {
      'Octaves': '3.5',
      'Reeds': 'Brass',
      'Keys': '39',
      'Bellows': '7-fold',
      'Weight': '8 kg',
      'Case': 'Included'
    },
    isFeatured: false,
    rating: 4.6,
    reviewCount: 89,
    sku: 'SB-HARMONIUM-HINDUSTAN-CLASSIC'
  },
  {
    name: 'Professional Tabla Set',
    description: 'Handcrafted tabla set with wooden bayan and leather heads. Includes tuning hammer and gatta.',
    price: 8999,
    originalPrice: 11999,
    category: 'tabla',
    brand: 'Professional',
    model: 'Classic',
    stockQuantity: 15,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800'
    ],
    specifications: {
      'Material': 'Wood & Leather',
      'Size': 'Standard',
      'Includes': 'Bayan, Dayan, Tuning Hammer',
      'Gatta': 'Included',
      'Case': 'Included',
      'Weight': '3 kg'
    },
    isFeatured: true,
    rating: 4.7,
    reviewCount: 156,
    sku: 'SB-TABLA-PROFESSIONAL-CLASSIC'
  }
];

const runSeeds = async () => {
  try {
    console.log('🌱 Running database seeds...');
    
    // Check if products already exist
    const existingProducts = await Product.count();
    if (existingProducts > 0) {
      console.log('⚠️ Products already exist, skipping seed data');
      process.exit(0);
    }
    
    // Create sample products
    await Product.bulkCreate(sampleProducts);
    
    console.log(`✅ Successfully seeded ${sampleProducts.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeeds(); 