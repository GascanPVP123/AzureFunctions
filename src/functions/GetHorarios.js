const { app } = require('@azure/functions');
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

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

app.http('GetHorarios', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const idCine = request.query.get('idCine');
            const idPelicula = request.query.get('idPelicula');

            if (!idCine || !idPelicula) {
                return { status: 400, body: "Faltan parámetros: usa ?idCine=X&idPelicula=Y" };
            }

            // 1. Buscamos el cine por su ID (como texto, según tu captura)
            const q = query(collection(db, "cines"), where("id", "==", idCine));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { status: 404, jsonBody: { error: "Cine no encontrado" } };
            }

            const datosCine = snapshot.docs[0].data();
            const listaPeliculas = datosCine.peliculas || [];

            // 2. Buscamos la película dentro del array del cine (por título o ID interno)
            // Usaremos el título o posición si tuvieras un ID ahí, 
            // pero basándonos en tu captura, buscaremos por el índice o título.
            const peliculaEncontrada = listaPeliculas.find(p => p.id == idPelicula || p.Titulo.includes(idPelicula));

            if (!peliculaEncontrada) {
                return { status: 404, jsonBody: { error: "Película no programada en este cine" } };
            }

            return { 
                status: 200, 
                jsonBody: { 
                    cine: datosCine.RazonSocial,
                    pelicula: peliculaEncontrada.Titulo,
                    horarios: peliculaEncontrada.Horarios 
                } 
            };

        } catch (error) {
            return { status: 500, body: error.message };
        }
    }
});