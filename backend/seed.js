/**
 * PropSpace Database Seed Script
 * Registers a demo user and inserts 30 sample property listings.
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

const IMAGE_LIBRARY = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80',
  'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
  'https://images.unsplash.com/photo-1601295452898-23b21cc0b5f8?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
];

const PROPERTY_TEMPLATES = [
  { title: 'Skyline Glass Penthouse', city: 'New York', country: 'USA', type: 'Apartment', price: 8500, description: 'Breathtaking 360° city views, floor-to-ceiling glass, private rooftop terrace, chef kitchen, and smart-home integration.' },
  { title: 'Beverly Hills Luxury Villa', city: 'Los Angeles', country: 'USA', type: 'House', price: 15000, description: 'Sprawling 6-bedroom villa with heated infinity pool, home theatre, wine cellar, and a manicured garden.' },
  { title: 'Cozy Shoreditch Studio', city: 'London', country: 'UK', type: 'Studio', price: 1800, description: 'Industrial-chic studio in East London with exposed brick, fast fiber, and steps from restaurants and galleries.' },
  { title: 'Parisian Haussmann Apartment', city: 'Paris', country: 'France', type: 'Apartment', price: 4200, description: 'Classic 3-bedroom Haussmann apartment with parquet floors, ornate mouldings, and a charming Juliet balcony.' },
  { title: 'Marina Bay Studio Retreat', city: 'Singapore', country: 'Singapore', type: 'Studio', price: 3100, description: 'Sleek waterfront studio with automated blinds, skyline views, and access to a rooftop infinity pool.' },
  { title: 'Beachfront Malibu Bungalow', city: 'Malibu', country: 'USA', type: 'House', price: 9800, description: 'Three-bedroom beachfront bungalow with wrap-around deck, outdoor shower, fire pit, and private beach access.' },
  { title: 'Tokyo Minimalist Apartment', city: 'Tokyo', country: 'Japan', type: 'Apartment', price: 3600, description: 'Zen-inspired apartment in Shibuya with tatami rooms, bespoke joinery, and panoramic city vistas.' },
  { title: 'Dubai Marina Skyscraper Suite', city: 'Dubai', country: 'UAE', type: 'Apartment', price: 18000, description: 'Ultra-luxury sky suite with private pool terrace, butler service, and breathtaking sea and skyline views.' },
  { title: 'Barcelona Gothic Quarter Loft', city: 'Barcelona', country: 'Spain', type: 'Studio', price: 2400, description: 'Artist loft with exposed stone walls, high ceilings, mezzanine bedroom, and a private patio.' },
  { title: 'Sydney Harbour View House', city: 'Sydney', country: 'Australia', type: 'House', price: 7200, description: 'Federation house with Harbour Bridge views, heritage features, sunny courtyard, and a garage.' },
  { title: 'Berlin Mitte Modern Studio', city: 'Berlin', country: 'Germany', type: 'Studio', price: 1350, description: 'Sophisticated studio with polished concrete floors, designer furniture, and a rooftop garden.' },
  { title: 'Santorini Cliffside Villa', city: 'Santorini', country: 'Greece', type: 'House', price: 11000, description: 'Whitewashed cliffside villa with a private infinity pool, sunset views, and cave-style architecture.' },
  { title: 'Miami Bayfront Residence', city: 'Miami', country: 'USA', type: 'House', price: 9200, description: 'Bayfront residence with a private dock, airy interiors, and sunset-facing outdoor lounges.' },
  { title: 'Amsterdam Canal-View Flat', city: 'Amsterdam', country: 'Netherlands', type: 'Apartment', price: 3900, description: 'Elegant canal-side flat with tall windows, warm oak finishes, and a quiet study nook.' },
  { title: 'Vancouver Rainforest Retreat', city: 'Vancouver', country: 'Canada', type: 'House', price: 6400, description: 'Modern retreat framed by forest views, with a spa bathroom, cedar deck, and fireplace.' },
  { title: 'Seoul Skyline Micro Loft', city: 'Seoul', country: 'South Korea', type: 'Studio', price: 2100, description: 'Compact loft with smart storage, ambient lighting, and striking skyline views from the upper floors.' },
  { title: 'Cape Town Oceanfront Villa', city: 'Cape Town', country: 'South Africa', type: 'House', price: 7800, description: 'Oceanfront villa with panoramic Atlantic views, open-plan living, and a sunset terrace.' },
  { title: 'Lisbon Alfama Artist Apartment', city: 'Lisbon', country: 'Portugal', type: 'Apartment', price: 2600, description: 'Bright artist apartment in Alfama with tiled accents, a reading balcony, and cobblestone charm.' },
  { title: 'Toronto Downtown Executive Suite', city: 'Toronto', country: 'Canada', type: 'Apartment', price: 4500, description: 'Executive suite in the downtown core with concierge service, skyline views, and modern finishes.' },
  { title: 'Rome Trastevere Terrace Home', city: 'Rome', country: 'Italy', type: 'House', price: 5300, description: 'Terrace home with warm stone interiors, leafy courtyard access, and historic neighbourhood charm.' },
  { title: 'Austin Tech District Studio', city: 'Austin', country: 'USA', type: 'Studio', price: 1700, description: 'Clean, modern studio steps from the tech district with coworking access and bright natural light.' },
  { title: 'Chicago Riverfront Loft', city: 'Chicago', country: 'USA', type: 'Apartment', price: 4700, description: 'Loft with exposed beams, river views, and a polished living space near the city center.' },
  { title: 'Singapore Orchard Road Residence', city: 'Singapore', country: 'Singapore', type: 'Apartment', price: 6100, description: 'Premium residence near Orchard Road with curated interiors, lap pool access, and city convenience.' },
  { title: 'Istanbul Bosphorus Panorama Villa', city: 'Istanbul', country: 'Turkey', type: 'House', price: 8600, description: 'Panorama villa overlooking the Bosphorus, featuring wide terraces and classic architectural details.' },
  { title: 'Copenhagen Nordic Courtyard Flat', city: 'Copenhagen', country: 'Denmark', type: 'Apartment', price: 4800, description: 'Nordic flat with pale timber finishes, courtyard light, and a calm minimalist layout.' },
  { title: 'Auckland Harbour House', city: 'Auckland', country: 'New Zealand', type: 'House', price: 6900, description: 'Harbour-facing home with a broad deck, sea breezes, and open living spaces for entertaining.' },
  { title: 'Edinburgh Royal Mile Studio', city: 'Edinburgh', country: 'Scotland', type: 'Studio', price: 1900, description: 'Character-rich studio with stone textures, a loft bed, and central access to the Royal Mile.' },
  { title: 'Mexico City Polanco Penthouse', city: 'Mexico City', country: 'Mexico', type: 'Apartment', price: 5200, description: 'Polanco penthouse with a wide terrace, curated art walls, and elegant entertaining areas.' },
  { title: 'Rio Copacabana Beach Apartment', city: 'Rio de Janeiro', country: 'Brazil', type: 'Apartment', price: 3400, description: 'Beach apartment with balcony views of Copacabana, breezy interiors, and easy shoreline access.' },
  { title: 'Prague Old Town Heritage Loft', city: 'Prague', country: 'Czech Republic', type: 'Studio', price: 2800, description: 'Heritage loft with timber beams, warm lighting, and walking distance to Old Town Square.' },
];

const PROPERTIES = PROPERTY_TEMPLATES.map((property, index) => ({
  title: property.title,
  description: property.description,
  price: property.price,
  location: { city: property.city, country: property.country },
  propertyType: property.type,
  imageUrls: [IMAGE_LIBRARY[index % IMAGE_LIBRARY.length]],
}));

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
