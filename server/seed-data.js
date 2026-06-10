const mongoose = require('mongoose');
require('dotenv').config();

const { connectDB, Product, SavedPaint, PaintType, Chemical } = require('./models');

const seedData = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to preserve data)
    // await Product.deleteMany({});
    // await SavedPaint.deleteMany({});
    // await PaintType.deleteMany({});
    // console.log('✅ Cleared existing data');

    // Seed Paint Types
    const paintTypes = [
      { name: 'Water-based' },
      { name: 'Oil-based' },
      { name: 'Latex' },
      { name: 'Enamel' },
      { name: 'Primer' },
      { name: 'Polyurethane' }
    ];

    const createdTypes = await PaintType.insertMany(paintTypes, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.log('⚠️  Some paint types already exist, skipping duplicates');
        return [];
      }
      throw err;
    });

    console.log(`✅ Seeded ${createdTypes.length} paint types`);

    // Seed Sample Products
    const sampleProducts = [
      {
        serialNumber: 'SN-' + Date.now() + '-SAMPLE1',
        productName: 'Washable Premium Wall Paint - White',
        brand: 'Dulux',
        paintType: 'Acrylic',
        quantity: '5L',
        expiryDate: '2025-12-31',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serialNumber: 'SN-' + (Date.now() + 1) + '-SAMPLE2',
        productName: 'Premium Wall Paint - Sky Blue',
        brand: 'Dulux',
        paintType: 'Acrylic',
        quantity: '10L',
        expiryDate: '2026-06-30',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serialNumber: 'SN-' + (Date.now() + 2) + '-SAMPLE3',
        productName: 'High Gloss Enamel - Red',
        brand: 'Asian Paints',
        paintType: 'Enamel',
        quantity: '1L',
        expiryDate: '2025-09-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serialNumber: 'SN-' + (Date.now() + 3) + '-SAMPLE4',
        productName: 'Wood Primer - Clear',
        brand: 'Sherwin-Williams',
        paintType: 'Primer',
        quantity: '3.78L',
        expiryDate: '2026-03-20',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.log('⚠️  Some products already exist, skipping duplicates');
        return [];
      }
      throw err;
    });

    console.log(`✅ Seeded ${createdProducts.length} sample products`);

    // Seed Sample Saved Paints (Templates)
    const sampleSavedPaints = [
      {
        name: 'Sky Blue',
        brand: 'Dulux',
        paintType: 'Acrylic',
        quantity: '5L',
        color: '#87CEEB',
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Forest Green',
        brand: 'Asian Paints',
        paintType: 'Acrylic',
        quantity: '10L',
        color: '#228B22',
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sunset Orange',
        brand: 'Sherwin-Williams',
        paintType: 'Enamel',
        quantity: '1L',
        color: '#FF7F50',
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pure White',
        brand: 'Dulux',
        paintType: 'Primer',
        quantity: '3.78L',
        color: '#FFFFFF',
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const createdSavedPaints = await SavedPaint.insertMany(sampleSavedPaints, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.log('⚠️  Some saved paints already exist, skipping duplicates');
        return [];
      }
      throw err;
    });

    console.log(`✅ Seeded ${createdSavedPaints.length} sample saved paints`);

    // Seed Sample Chemicals
    const sampleChemicals = [
      {
        serialNumber: 'CHEM-' + Date.now() + '-01',
        chemicalName: 'Sodium Hydroxide',
        manufacturer: 'Sigma-Aldrich',
        chemicalType: 'Base',
        quantity: '500',
        unit: 'g',
        hazardLevel: 'High',
        storageLocation: 'Cabinet A, Shelf 1',
        expiryDate: '2026-12-31',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serialNumber: 'CHEM-' + (Date.now() + 1) + '-02',
        chemicalName: 'Acetic Acid',
        manufacturer: 'Acros Organics',
        chemicalType: 'Acid',
        quantity: '1',
        unit: 'L',
        hazardLevel: 'Medium',
        storageLocation: 'Cabinet B, Shelf 2',
        expiryDate: '2025-06-30',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serialNumber: 'CHEM-' + (Date.now() + 2) + '-03',
        chemicalName: 'Dimethyl Sulfoxide',
        manufacturer: 'Fisher Scientific',
        chemicalType: 'Solvent',
        quantity: '250',
        unit: 'mL',
        hazardLevel: 'Medium',
        storageLocation: 'Cabinet A, Shelf 3',
        expiryDate: '2026-09-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        serialNumber: 'CHEM-' + (Date.now() + 3) + '-04',
        chemicalName: 'Ethanol',
        manufacturer: 'Carlo Erba',
        chemicalType: 'Solvent',
        quantity: '500',
        unit: 'mL',
        hazardLevel: 'Medium',
        storageLocation: 'Cabinet C, Shelf 1',
        expiryDate: '2025-03-30',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const createdChemicals = await Chemical.insertMany(sampleChemicals, { ordered: false }).catch(err => {
      if (err.code === 11000) {
        console.log('⚠️  Some chemicals already exist, skipping duplicates');
        return [];
      }
      throw err;
    });

    console.log(`✅ Seeded ${createdChemicals.length} sample chemicals`);

    console.log('\n🎉 Seed data completed successfully!');
    console.log('\n📊 Database Summary:');
    const paintTypeCount = await PaintType.countDocuments();
    const productCount = await Product.countDocuments();
    const savedPaintCount = await SavedPaint.countDocuments();
    const chemicalCount = await Chemical.countDocuments();
    console.log(`   - Paint Types: ${paintTypeCount}`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Saved Paints: ${savedPaintCount}`);
    console.log(`   - Chemicals: ${chemicalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
