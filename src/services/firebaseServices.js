import { collection, addDoc, getDocs, doc, getDoc, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";

// Function to add an item to Firestore
export const addItem = async (item) => {
  try {
    await addDoc(collection(db, "items"), item);
  } catch (error) {
    console.error("Error adding item: ", error);
    throw error;
  }
};

// Function to fetch items from Firestore
export const fetchItems = async (userId) => {
  try {
    const q = query(collection(db, "items"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching items: ", error);
    throw error;
  }
};

// Function to fetch a single item from Firestore
export const fetchItem = async (itemId) => {
  try {
    const itemDoc = await getDoc(doc(db, "items", itemId));
    if (itemDoc.exists()) {
      return itemDoc.data();
    }
    throw new Error("Item not found");
  } catch (error) {
    console.error("Error fetching item: ", error);
    throw error;
  }
};

// Function to update an item in Firestore
export const updateItem = async (itemId, updatedItem) => {
  try {
    await updateDoc(doc(db, "items", itemId), updatedItem);
  } catch (error) {
    console.error("Error updating item: ", error);
    throw error;
  }
};

// Function to fetch user details
export const fetchUserDetails = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user details: ", error);
    throw error;
  }
};

// Function to delete an item from Firestore
export const deleteItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, "items", itemId));
  } catch (error) {
    console.error("Error deleting item: ", error);
    throw error;
  }
};

// Function to fetch sales data
export const fetchSales = async (userId) => {
  try {
    const q = query(collection(db, "sales"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching sales data: ", error);
    throw error;
  }
};

// Function to handle authentication state changes
export const observeAuthState = (setUserId) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
    } else {
      setUserId(null);
    }
  });
};

// Function to fetch sales data by date
export const fetchSalesByDate = async (userId, startDate, endDate) => {
    try {
      const q = query(
        collection(db, 'sales'),
        where('userId', '==', userId),
        where('timestamp', '>=', startDate),
        where('timestamp', '<', endDate)
      );
      const querySnapshot = await getDocs(q);
      const salesList = [];
      querySnapshot.forEach(doc => {
        salesList.push(doc.data());
      });
      return salesList;
    } catch (error) {
      console.error('Error fetching sales data by date: ', error);
      throw error;
    }
  };
