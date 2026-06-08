const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, 'qr_paint.db');
const db = new sqlite3.Database(DB_PATH);

const database = {
  init: function() {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          serialNumber TEXT UNIQUE,
          productName TEXT NOT NULL,
          brand TEXT NOT NULL,
          paintType TEXT NOT NULL,
          quantity TEXT NOT NULL,
          expiryDate TEXT NOT NULL,
          qrCode TEXT,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS saved_paints (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          brand TEXT NOT NULL,
          paintType TEXT NOT NULL,
          quantity TEXT NOT NULL,
          color TEXT,
          isFavorite INTEGER DEFAULT 0,
          createdAt TEXT,
          updatedAt TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS paint_types (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          createdAt TEXT
        )
      `);

      // Insert default paint types
      const defaultTypes = ['Acrylic', 'Oil-based', 'Latex', 'Enamel', 'Primer', 'Polyurethane'];
      defaultTypes.forEach(type => {
        db.run(`
          INSERT OR IGNORE INTO paint_types (id, name, createdAt)
          VALUES (?, ?, ?)
        `, [uuidv4(), type, new Date().toISOString()]);
      });
      
      console.log('Database initialized');
    });
  },

  addProduct: function(product, callback) {
    const id = uuidv4();
    const serialNumber = 'SN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO products (id, serialNumber, productName, brand, paintType, quantity, expiryDate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, serialNumber, product.productName, product.brand, product.paintType, product.quantity, product.expiryDate, now, now, function(err) {
      if (err) return callback(err);
      callback(null, { id, serialNumber, ...product, createdAt: now });
    });
    stmt.finalize();
  },

  getAllProducts: function(callback) {
    db.all('SELECT * FROM products ORDER BY createdAt DESC', callback);
  },

  getProductById: function(id, callback) {
    db.get('SELECT * FROM products WHERE id = ?', [id], callback);
  },

  getProductBySerialNumber: function(serialNumber, callback) {
    db.get('SELECT * FROM products WHERE serialNumber = ?', [serialNumber], callback);
  },

  updateProduct: function(id, product, callback) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE products 
      SET productName = ?, brand = ?, paintType = ?, quantity = ?, expiryDate = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(product.productName, product.brand, product.paintType, product.quantity, product.expiryDate, now, id, function(err) {
      if (err) return callback(err);
      callback(null, { id, ...product, updatedAt: now });
    });
    stmt.finalize();
  },

  deleteProduct: function(id, callback) {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    stmt.run(id, callback);
    stmt.finalize();
  },

  saveQRCode: function(id, qrCodeData, callback) {
    const stmt = db.prepare('UPDATE products SET qrCode = ? WHERE id = ?');
    stmt.run(qrCodeData, id, callback);
    stmt.finalize();
  },

  // Saved Paints Methods
  addSavedPaint: function(paint, callback) {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO saved_paints (id, name, brand, paintType, quantity, color, isFavorite, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, paint.name, paint.brand, paint.paintType, paint.quantity, paint.color || '', 0, now, now, function(err) {
      if (err) return callback(err);
      callback(null, { id, ...paint, isFavorite: 0, createdAt: now });
    });
    stmt.finalize();
  },

  getAllSavedPaints: function(callback) {
    db.all('SELECT * FROM saved_paints ORDER BY isFavorite DESC, createdAt DESC', callback);
  },

  toggleFavoritePaint: function(id, callback) {
    const stmt = db.prepare('UPDATE saved_paints SET isFavorite = (1 - isFavorite) WHERE id = ?');
    stmt.run(id, callback);
    stmt.finalize();
  },

  deleteSavedPaint: function(id, callback) {
    const stmt = db.prepare('DELETE FROM saved_paints WHERE id = ?');
    stmt.run(id, callback);
    stmt.finalize();
  },

  updateSavedPaint: function(id, paint, callback) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE saved_paints 
      SET name = ?, brand = ?, paintType = ?, quantity = ?, color = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(paint.name, paint.brand, paint.paintType, paint.quantity, paint.color || '', now, id, function(err) {
      if (err) return callback(err);
      callback(null, { id, ...paint, updatedAt: now });
    });
    stmt.finalize();
  },

  // Paint Types Methods
  getAllPaintTypes: function(callback) {
    db.all('SELECT * FROM paint_types ORDER BY name ASC', callback);
  },

  addPaintType: function(name, callback) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO paint_types (id, name, createdAt)
      VALUES (?, ?, ?)
    `);

    stmt.run(id, name, now, function(err) {
      if (err) return callback(err);
      callback(null, { id, name, createdAt: now });
    });
    stmt.finalize();
  },

  deletePaintType: function(id, callback) {
    const stmt = db.prepare('DELETE FROM paint_types WHERE id = ?');
    stmt.run(id, callback);
    stmt.finalize();
  }
};

module.exports = database;
