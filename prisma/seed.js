require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Clear existing products
  await prisma.product.deleteMany({});
  
  const workbook = XLSX.readFile(path.join(__dirname, 'trackshoe.xlsx'));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    if (row.CurrentPhase === 'Approved') {
      await prisma.product.create({
        data: {
          ppapId: row.PPAPID || '',
          partNumber: row.PartNumber || '',
          partName: row.PartName || '',
          currentPhase: row.CurrentPhase || '',
          profile: String(row['1EProfile'] || ''),
          weightKg: parseFloat(row.WeightKg) || 0,
          lengthMm: parseFloat(row.Lengthmm) || 0,
          boltHoleDia: parseFloat(row.BoltHoleDia) || 0,
          pitch: parseFloat(row.Pitch) || 0,
          supplierName: row.SupplierName || '',
          price: Math.round((parseFloat(row.WeightKg) || 0) * 5 * 100) / 100,
        },
      });
    }
  }
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
