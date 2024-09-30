// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configuración de Firebase
const firebaseConfig = {
	apiKey: "AIzaSyCfeLvVgN6BuFplDeiuQO16Qa0MhBUUvjc",
	authDomain: "to-do-e0ce5.firebaseapp.com",
	projectId: "to-do-e0ce5",
	storageBucket: "to-do-e0ce5.appspot.com",
	messagingSenderId: "788214877908",
	appId: "1:788214877908:web:ccd60d44bdcf927f3ab541",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
