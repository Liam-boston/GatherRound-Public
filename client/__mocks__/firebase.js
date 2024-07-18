// Configuration for mocking Firestore (for testing purposes)
export const initializeApp = jest.fn();
export const getFirestore = jest.fn();
export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn((callback) => {
    callback(mockUser); // Involve callback with mockUser
    return () => {}; // Return unsubscribe function
  }),
  signOut: jest.fn()
}));
export const collection = jest.fn();
export const getDocs = jest.fn();
export const setDoc = jest.fn();
export const doc = jest.fn();
export const createUserWithEmailAndPassword = jest.fn().mockResolvedValue({
  uid: 'fakeUserID',
  email: 'test@mail.com'
});
export const signInWithEmailAndPassword = jest.fn().mockResolvedValue({});