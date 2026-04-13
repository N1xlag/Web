require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TechDrops Bolivia...');

  // Limpiar productos existentes (cuidado en producción)
  await prisma.producto.deleteMany();

  const productos = [
    {
      nombre: 'Smart Glasses HD',
      slug: 'smart-glasses-hd',
      precio: 350,
      anticipo: 50,
      stock: 12,
    },
    {
      nombre: 'Powerbank Térmico',
      slug: 'powerbank-termico',
      precio: 180,
      anticipo: 50,
      stock: 8,
    },
    {
      nombre: 'Kit Premium Primeros Auxilios Auto',
      slug: 'kit-primeros-auxilios-auto',
      precio: 220,
      anticipo: 50,
      stock: 5,
    },
  ];

  for (const producto of productos) {
    await prisma.producto.upsert({
      where: { slug: producto.slug },
      update: producto,
      create: producto,
    });
    console.log(`  ✅ ${producto.nombre} (stock: ${producto.stock})`);
  }

  console.log('\n🚀 Seed completado. Productos listos en la BD.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });