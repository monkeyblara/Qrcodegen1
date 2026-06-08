const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const { Product, SavedPaint, PaintType, connectDB } = require('./models');

const DB_PATH = path.join(__dirname, 'qr_paint.db');

// Open SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error opening SQLite database:', err.message);
    process.exit(1);
  }
});

const migrate = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Migrate Paint Types
    console.log('\n📋 Migrating Paint Types...');
    const paintTypes = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM paint_types', (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });

    if (paintTypes.length > 0) {
      const typesToInsert = paintTypes.map(type => ({
        name: type.name,
        createdAt: new Date(type.createdAt)
      }));

      await PaintType.insertMany(typesToInsert, { ordered: false }).catch(err => {
        if (err.code === 11000) {
          console.log('⚠️  Some paint types already exist, skipping duplicates');
        } else {
          throw err;
        }
      });

      console.log(`✅ Migrated ${paintTypes.length} paint types`);
    } else {
      console.log('ℹ️  No paint types to migrate');
    }

    // Migrate Products
    console.log('\n📦 Migrating Products...');
    const products = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM products', (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });

    if (products.length > 0) {
      const productsToInsert = products.map(product => ({
        serialNumber: product.serialNumber,
        productName: product.productName,
        brand: product.brand,
        paintType: product.paintType,
        quantity: product.quantity,
        expiryDate: product.expiryDate,
        qrCode: product.qrCode || undefined,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      }));

      await Product.insertMany(productsToInsert, { ordered: false }).catch(err => {
        if (err.code === 11000) {
          console.log('⚠️  Some products already exist (duplicate serial numbers), skipping duplicates');
        } else {
          throw err;
        }
      });

      console.log(`✅ Migrated ${products.length} products`);
    } else {
      console.log('ℹ️  No products to migrate');
    }

    // Migrate Saved Paints
    console.log('\n🎨 Migrating Saved Paints...');
    const savedPaints = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM saved_paints', (err, rows) => {
        if (err) reject(err);
        resolve(rows || []);
      });
    });

    if (savedPaints.length > 0) {
      const paintsToInsert = savedPaints.map(paint => ({
        name: paint.name,
        brand: paint.brand,
        paintType: paint.paintType,
        quantity: paint.quantity,
        color: paint.color || '#ffffff',
        isFavorite: Boolean(paint.isFavorite),
        createdAt: new Date(paint.createdAt),
        updatedAt: new Date(paint.updatedAt)
      }));

      await SavedPaint.insertMany(paintsToInsert, { ordered: false }).catch(err => {
        if (err.code === 11000) {
          console.log('⚠️  Some saved paints already exist, skipping duplicates');
        } else {
          throw err;
        }
      });

      console.log(`✅ Migrated ${savedPaints.length} saved paints`);
    } else {
      console.log('ℹ️  No saved paints to migrate');
    }

    // Summary
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📊 MongoDB Data Summary:');
    const paintTypeCount = await PaintType.countDocuments();
    const productCount = await Product.countDocuments();
    const savedPaintCount = await SavedPaint.countDocuments();
    console.log(`   - Paint Types: ${paintTypeCount}`);
    console.log(`   - Products: ${productCount}`);
    console.log(`   - Saved Paints: ${savedPaintCount}`);

    db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    db.close();
    process.exit(1);
  }
};

migrate();
