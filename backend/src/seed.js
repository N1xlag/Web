const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la carga de productos a Supabase...');
  
  await prisma.producto.createMany({
    data: [
      { 
        nombre: 'Smart Glasses HD', 
        slug: 'smart-glasses-hd', 
        precio: 0, 
        anticipo: 50, 
        stock: 100 // Pon la cantidad real que te llegará de China
      },
      { 
        nombre: 'Powerbank Térmico', 
        slug: 'powerbank-termico', 
        precio: 0, 
        anticipo: 50, 
        stock: 100 
      },
      { 
        nombre: 'Kit Premium Primeros Auxilios Auto', 
        slug: 'kit-primeros-auxilios-auto', 
        precio: 0, 
        anticipo: 50, 
        stock: 100 
      },
    ],
    skipDuplicates: true, // Por si lo ejecutas dos veces por error
  });

  console.log('✅ ¡Inventario inicial cargado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error cargando los datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });