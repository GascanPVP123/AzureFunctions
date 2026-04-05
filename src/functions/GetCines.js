const { app } = require('@azure/functions');
const { initializeApp, getApps } = require('firebase/app');
const  { getFirestore, collection, getDocs } = require('firebase/firestore');   

const firebaseConfig = {
  apiKey: "AIzaSyCSNrN6j1abXC-nfk0RkaRb_Wp6FpVxGRU",
  authDomain: "biayofirebase.firebaseapp.com",
  databaseURL: "https://biayofirebase-default-rtdb.firebaseio.com",
  projectId: "biayofirebase",
  storageBucket: "biayofirebase.firebasestorage.app",
  messagingSenderId: "621165497120",
  appId: "1:621165497120:web:3f8e2e3c877a0584902545",
  measurementId: "G-F3R8XWN729"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];  
const db  = getFirestore(firebaseApp);

app.http('GetCines', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        
        try {
            const querySnapshot = await getDocs(collection(db, "cines"));
            const cines = querySnapshot.docs.map(doc => ({ 
                idDoc: doc.id, 
                ...doc.data() 
            }));

            return { status: 200, jsonBody: cines };
                } catch (error) {
                return { status: 500, body: "Error leyendo Firebase: " + error.message };
        }
        
    }
});
