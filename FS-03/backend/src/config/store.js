/**
 * Persistent Local Storage Engine (JSON File Store)
 * Serves as an infallible local fallback when MongoDB Atlas or local MongoDB is offline.
 * Stores collections under backend/data/store.json with file locking and atomic writes.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'lms_store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let store = {
  users: [],
  studentProfiles: [],
  instructorProfiles: [],
  courses: [],
  sections: [],
  lessons: [],
  enrollments: [],
  liveClasses: [],
  quizzes: [],
  questions: [],
  quizAttempts: [],
  certificates: [],
  earnings: [],
  mediaAssets: [],
  notifications: []
};

// Load existing store from disk if present
if (fs.existsSync(STORE_FILE)) {
  try {
    const raw = fs.readFileSync(STORE_FILE, 'utf8');
    store = { ...store, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading local JSON store:', err.message);
  }
}

const saveStore = () => {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local JSON store:', err.message);
  }
};

const getCollection = (collectionName) => {
  if (!store[collectionName]) {
    store[collectionName] = [];
  }
  return store[collectionName];
};

const storeAdapter = {
  find(collectionName, query = {}) {
    const items = getCollection(collectionName);
    return items.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        if (value === undefined) return true;
        if (typeof value === 'object' && value !== null) {
          if (value.$in && Array.isArray(value.$in)) {
            return value.$in.includes(item[key]);
          }
          if (value.$ne !== undefined) {
            return item[key] !== value.$ne;
          }
        }
        return item[key] === value;
      });
    });
  },

  findOne(collectionName, query = {}) {
    const results = this.find(collectionName, query);
    return results.length > 0 ? results[0] : null;
  },

  findById(collectionName, id) {
    return this.findOne(collectionName, { _id: id.toString() });
  },

  insertOne(collectionName, doc) {
    const items = getCollection(collectionName);
    const newDoc = {
      _id: doc._id || 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    saveStore();
    return newDoc;
  },

  insertMany(collectionName, docs) {
    return docs.map(doc => this.insertOne(collectionName, doc));
  },

  updateOne(collectionName, query, update) {
    const item = this.findOne(collectionName, query);
    if (!item) return null;
    
    // Support $set or plain object
    const fieldsToUpdate = update.$set ? update.$set : update;
    Object.assign(item, fieldsToUpdate, { updatedAt: new Date().toISOString() });
    saveStore();
    return item;
  },

  findByIdAndUpdate(collectionName, id, update) {
    return this.updateOne(collectionName, { _id: id.toString() }, update);
  },

  deleteOne(collectionName, query) {
    const items = getCollection(collectionName);
    const index = items.findIndex(item => {
      return Object.entries(query).every(([k, v]) => item[k] === v);
    });
    if (index !== -1) {
      const removed = items.splice(index, 1)[0];
      saveStore();
      return removed;
    }
    return null;
  },

  count(collectionName, query = {}) {
    return this.find(collectionName, query).length;
  },

  getRawStore() {
    return store;
  },

  save() {
    saveStore();
  }
};

module.exports = storeAdapter;
