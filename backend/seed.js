/**
 * PropSpace Database Seed Script
 * Registers a demo user and inserts 12 sample property listings.
 * Run with: node seed.js
 */
const http = require('http');

const API_HOST = '127.0.0.1';
const API_PORT = 5000;

// ─── Helpers ────────────────────────────────────────────────────────────────

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: API_HOST,
      port: API_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ─── Demo User ───────────────────────────────────────────────────────────────

const DEMO_USER = {
  username: 'propspace_demo',
  email:    'demo@propspace.app',
  password: 'demo1234',
  name:     'PropSpace Demo',
  phone:    '+1 (555) 010-2030',
  avatar:   'https://api.dicebear.com/8.x/avataaars/svg?seed=propspace',
};

// ─── Sample Properties ────────────────────────────────────────────────────────

const PROPERTIES = [
  {
    title: 'Skyline Glass Penthouse',
    description:
      'Breathtaking 360° city views from this ultra-modern penthouse. Floor-to-ceiling glass panels, a private rooftop terrace, chef kitchen, and smart-home integration throughout.',
    price: 8500,
    location: { city: 'New York', country: 'USA' },
    propertyType: 'Apartment',
    imageUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
  },
  {
    title: 'Beverly Hills Luxury Villa',
    description:
      'Sprawling 6-bedroom villa nestled in the hills with a heated infinity pool, home theatre, wine cellar, and manicured garden. Hollywood at your doorstep.',
    price: 15000,
    location: { city: 'Los Angeles', country: 'USA' },
    propertyType: 'House',
    imageUrls: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80',
    ],
  },
  {
    title: 'Cozy Shoreditch Studio',
    description:
      'Stylish compact studio in the heart of East London\'s creative quarter. Industrial-chic interiors, exposed brick, high-speed fiber, and steps from top restaurants and galleries.',
    price: 1800,
    location: { city: 'London', country: 'UK' },
    propertyType: 'Studio',
    imageUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
  },
  {
    title: 'Parisian Haussmann Apartment',
    description:
      'Classic 3-bedroom Haussmann apartment on the 4th floor with original parquet floors, ornate mouldings, a charming Juliet balcony, and views over a leafy boulevard.',
    price: 4200,
    location: { city: 'Paris', country: 'France' },
    propertyType: 'Apartment',
    imageUrls: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    ],
  },
  {
    title: 'Marina Bay Studio Retreat',
    description:
      'Sleek studio with direct waterfront views of Marina Bay Sands. Fully furnished, automated blinds, and access to a rooftop infinity pool and sky gym.',
    price: 3100,
    location: { city: 'Singapore', country: 'Singapore' },
    propertyType: 'Studio',
    imageUrls: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
    ],
  },
  {
    title: 'Beachfront Malibu Bungalow',
    description:
      'Wake up to the sound of waves in this iconic 3-bedroom beachfront bungalow. Wrap-around deck, outdoor shower, fire pit, and private beach access. Perfect coastal retreat.',
    price: 9800,
    location: { city: 'Malibu', country: 'USA' },
    propertyType: 'House',
    imageUrls: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    ],
  },
  {
    title: 'Tokyo Minimalist Apartment',
    description:
      'Zen-inspired 2-bedroom apartment in Shibuya with tatami rooms, bespoke Japanese joinery, a deep soaking bath, and panoramic city vistas from the 32nd floor.',
    price: 3600,
    location: { city: 'Tokyo', country: 'Japan' },
    propertyType: 'Apartment',
    imageUrls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    ],
  },
  {
    title: 'Dubai Marina Skyscraper Suite',
    description:
      'Ultra-luxury 4-bedroom sky suite on the 58th floor of a signature Dubai Marina tower. Private pool terrace, butler service, and breathtaking sea and skyline views.',
    price: 18000,
    location: { city: 'Dubai', country: 'UAE' },
    propertyType: 'Apartment',
    imageUrls: [
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    ],
  },
  {
    title: 'Barcelona Gothic Quarter Loft',
    description:
      'Spacious artist\'s loft in the heart of El G\u00f2tic, just meters from the Cathedral. Exposed stone walls, 5-metre ceilings, a mezzanine bedroom, and a private patio.',
    price: 2400,
    location: { city: 'Barcelona', country: 'Spain' },
    propertyType: 'Studio',
    imageUrls: [
      'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',
    ],
  },
  {
    title: 'Sydney Harbour View House',
    description:
      'Stunning 4-bedroom Federation house with direct Harbour Bridge views. Original heritage features blended with contemporary extensions, sunny courtyard, and garage.',
    price: 7200,
    location: { city: 'Sydney', country: 'Australia' },
    propertyType: 'House',
    imageUrls: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&q=80',
    ],
  },
  {
    title: 'Berlin Mitte Modern Studio',
    description:
      'Sophisticated studio in Berlin-Mitte with polished concrete floors, designer furniture, and access to a communal rooftop garden. Walking distance to Museum Island.',
    price: 1350,
    location: { city: 'Berlin', country: 'Germany' },
    propertyType: 'Studio',
    imageUrls: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    ],
  },
  {
    title: 'Santorini Cliffside Villa',
    description:
      'Iconic whitewashed 3-bedroom villa carved into the Oia caldera cliffs with a private infinity pool, world-famous sunset views, and traditional cave architecture.',
    price: 11000,
    location: { city: 'Santorini', country: 'Greece' },
    propertyType: 'House',
    imageUrls: [
      'https://images.unsplash.com/photo-1601295452898-23b21cc0b5f8?w=800&q=80',
      'https://images.unsplash.com/photo-1548625361-58a9b86aa83b?w=800&q=80',
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱  PropSpace Database Seed\n' + '─'.repeat(42));

  // 1. Try to register the demo user
  console.log('\n[1/3] Registering demo user...');
  let token;

  const regRes = await request('POST', '/api/auth/register', DEMO_USER);

  if (regRes.status === 201) {
    console.log('     ✅  Demo user created.');
    token = regRes.data.token;
  } else if (regRes.status === 400 && /already exists/i.test(regRes.data?.message || '')) {
    // User already exists – log in instead
    console.log('     ℹ️   Demo user already exists. Logging in...');
    const loginRes = await request('POST', '/api/auth/login', {
      loginIdentifier: DEMO_USER.email,
      password:        DEMO_USER.password,
    });

    if (loginRes.status === 200) {
      console.log('     ✅  Logged in successfully.');
      token = loginRes.data.token;
    } else {
      console.error('     ❌  Login failed:', loginRes.data);
      process.exit(1);
    }
  } else {
    console.error('     ❌  Registration error:', regRes.data);
    process.exit(1);
  }

  // 2. Insert each property
  console.log(`\n[2/3] Seeding ${PROPERTIES.length} property listings...`);
  let success = 0;
  let skipped = 0;

  for (const prop of PROPERTIES) {
    const res = await request('POST', '/api/properties', prop, token);
    if (res.status === 201) {
      console.log(`     ✅  Created: "${prop.title}"`);
      success++;
    } else {
      console.warn(`     ⚠️   Skipped: "${prop.title}" — ${res.data?.message}`);
      skipped++;
    }
  }

  // 3. Summary
  console.log('\n[3/3] Summary');
  console.log(`     Properties created : ${success}`);
  console.log(`     Properties skipped : ${skipped}`);
  console.log('\n✨  Seed complete! Open http://localhost:5173 to see the listings.\n');
}

seed().catch((err) => {
  console.error('\n❌  Unexpected error during seed:', err.message);
  process.exit(1);
});
