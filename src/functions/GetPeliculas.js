const { app } = require('@azure/functions');
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyCSNrN6j1abXC-nfk0RkaRb_Wp6FpVxGRU",
    authDomain: "biayofirebase.firebaseapp.com",
    projectId: "biayofirebase",
    storageBucket: "biayofirebase.firebasestorage.app",
    messagingSenderId: "621165497120",
    appId: "1:621165497120:web:3f8e2e3c877a0584902545"
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);

app.http('GetPeliculas', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const tipo = request.query.get('tipo');
            let q = collection(db, "peliculas");

            if (tipo) {
                q = query(q, where("idEstado", "==", parseInt(tipo)), orderBy("id"));
            }

            const snapshot = await getDocs(q);
            const peliculas = snapshot.docs.map(doc => ({ idDoc: doc.id, ...doc.data() }));

            return { status: 200, jsonBody: peliculas };
        } catch (error) {
            return { status: 500, body: error.message };
        }
    }
});