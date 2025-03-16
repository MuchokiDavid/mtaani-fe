// db.js
import { openDB } from "idb";

// Database name and version
const DB_NAME = "properypro-db";
const DB_VERSION = 1;

// Object store names (like tables in a database)
const STORE_MAINTENANCE = "maintenanceRequests";
const STORE_PROPERTIES = "properties";
const STORE_ROOMS = "rooms";
const STORE_USERS = "users";
const STORE_BOOKINGS = "bookings";
const STORE_ANNOUNCEMENTS = "announcements";

// Function to initialize the database
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORE_MAINTENANCE)) {
        db.createObjectStore(STORE_MAINTENANCE, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      // if (!db.objectStoreNames.contains(STORE_MAINTENANCE)) {
      //   const maintenanceStore = db.createObjectStore(STORE_MAINTENANCE, {
      //     keyPath: "id",
      //     autoIncrement: true,
      //   });
      //   maintenanceStore.createIndex("landlordId", "landlordId", {
      //     unique: false,
      //   });
      // }
      if (!db.objectStoreNames.contains(STORE_PROPERTIES)) {
        db.createObjectStore(STORE_PROPERTIES, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORE_ROOMS)) {
        db.createObjectStore(STORE_ROOMS, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORE_USERS)) {
        // Create the 'users' object store
        const store = db.createObjectStore(STORE_USERS, {
          keyPath: "id",
          autoIncrement: true,
        });
        // Create an index on the 'email' field
        store.createIndex("email", "email", { unique: true });
      } else {
        // If the 'users' object store already exists, ensure the 'email' index exists
        const tx = db.transaction(STORE_USERS, "readwrite");
        const store = tx.objectStore(STORE_USERS);
        if (!store.indexNames.contains("email")) {
          store.createIndex("email", "email", { unique: true });
        }
        tx.done;
      }
      if (!db.objectStoreNames.contains(STORE_BOOKINGS)) {
        db.createObjectStore(STORE_BOOKINGS, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains(STORE_ANNOUNCEMENTS)) {
        db.createObjectStore(STORE_ANNOUNCEMENTS, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

// Function to add data to an object store
const addData = async (storeName, data) => {
  const db = await initDB();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  await store.add(data);
  await tx.done;
};

// Function to get all data from an object store
const getAllData = async (storeName) => {
  const db = await initDB();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  return store.getAll();
};

// Function to update data in an object store
const updateData = async (storeName, id, data) => {
  const db = await initDB();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  await store.put({ ...data, id });
  await tx.done;
};

// Function to get data by ID from an object store
const getDataById = async (storeName, id) => {
  const db = await initDB();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  return store.get(id);
};

// Function to delete data from an object store
const deleteData = async (storeName, id) => {
  const db = await initDB();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  await store.delete(id);
  await tx.done;
};

// get user by email
const getUserByEmail = async (email) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_USERS, "readonly");
    const store = tx.objectStore(STORE_USERS);
    const index = store.index("email");
    return await index.get(email);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export {
  addData,
  getAllData,
  updateData,
  deleteData,
  getDataById,
  getUserByEmail,
  STORE_MAINTENANCE,
  STORE_PROPERTIES,
  STORE_ROOMS,
  STORE_USERS,
  STORE_BOOKINGS,
  STORE_ANNOUNCEMENTS,
};

// const initDB = async () => {
//   return openDB(DB_NAME, DB_VERSION, {
//     upgrade(db) {
//       // Create object stores if they don't exist
//       if (!db.objectStoreNames.contains(STORE_MAINTENANCE)) {
//         const maintenanceStore = db.createObjectStore(STORE_MAINTENANCE, {
//           keyPath: "id",
//           autoIncrement: true,
//         });
//         // Create an index on the 'roomId' field to establish a relationship with rooms
//         maintenanceStore.createIndex("roomId", "roomId", { unique: false });
//       }
//       if (!db.objectStoreNames.contains(STORE_PROPERTIES)) {
//         const propertiesStore = db.createObjectStore(STORE_PROPERTIES, {
//           keyPath: "id",
//           autoIncrement: true,
//         });
//         // Create an index on the 'landlordId' field to establish a relationship with users (landlords)
//         propertiesStore.createIndex("landlordId", "landlordId", {
//           unique: false,
//         });
//       }
//       if (!db.objectStoreNames.contains(STORE_ROOMS)) {
//         const roomsStore = db.createObjectStore(STORE_ROOMS, {
//           keyPath: "id",
//           autoIncrement: true,
//         });
//         // Create an index on the 'propertyId' field to establish a relationship with properties
//         roomsStore.createIndex("propertyId", "propertyId", { unique: false });
//       }
//       if (!db.objectStoreNames.contains(STORE_USERS)) {
//         const usersStore = db.createObjectStore(STORE_USERS, {
//           keyPath: "id",
//           autoIncrement: true,
//         });
//         // Create an index on the 'email' field
//         usersStore.createIndex("email", "email", { unique: true });
//         // Create an index on the 'roomId' field to establish a relationship with rooms (for tenants)
//         usersStore.createIndex("roomId", "roomId", { unique: true }); // Ensure one tenant per room
//       } else {
//         // If the 'users' object store already exists, ensure the 'email' and 'roomId' indices exist
//         const tx = db.transaction(STORE_USERS, "readwrite");
//         const store = tx.objectStore(STORE_USERS);
//         if (!store.indexNames.contains("email")) {
//           store.createIndex("email", "email", { unique: true });
//         }
//         if (!store.indexNames.contains("roomId")) {
//           store.createIndex("roomId", "roomId", { unique: true }); // Ensure one tenant per room
//         }
//         tx.done;
//       }
//       if (!db.objectStoreNames.contains(STORE_BOOKINGS)) {
//         db.createObjectStore(STORE_BOOKINGS, {
//           keyPath: "id",
//           autoIncrement: true,
//         });
//       }
//       if (!db.objectStoreNames.contains(STORE_ANNOUNCEMENTS)) {
//         const announcementsStore = db.createObjectStore(STORE_ANNOUNCEMENTS, {
//           keyPath: "id",
//           autoIncrement: true,
//         });
//         // Create an index on the 'landlordId' field to establish a relationship with users (landlords)
//         announcementsStore.createIndex("landlordId", "landlordId", {
//           unique: false,
//         });
//       }
//     },
//   });
// };
