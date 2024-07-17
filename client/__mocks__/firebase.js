// Configuration for mocking Firestore (for testing purposes)
export const initializeApp = jest.fn();
export const getFirestore = jest.fn();

// Firebase Auth functions
export const onAuthStateChanged = jest.fn();
export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn((callback) => {
    callback(mockUser); // Involve callback with mockUser
    return () => {}; // Return unsubscribe function
  }),
  signOut: jest.fn()
}));

// Firebase Firestore functions
export const collection = jest.fn();
export const doc = jest.fn();
export const addDoc = jest.fn();
export const getDocs = jest.fn();
export const setDoc = jest.fn();
export const updateDoc = jest.fn();
export const query = jest.fn();
export const orderBy = jest.fn();
export const arrayRemove = jest.fn();