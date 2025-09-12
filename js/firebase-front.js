// firebase-frontend.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQVNsVVzdnYnVFl8SEA6PcgOHweNo3jNs",
  authDomain: "cardapio-lanchonete-44865.firebaseapp.com",
  projectId: "cardapio-lanchonete-44865",
  storageBucket: "cardapio-lanchonete-44865.firebasestorage.app",
  messagingSenderId: "306826844607",
  appId: "1:306826844607:web:308162e051110f184fa90a",
  measurementId: "G-5MQLFWN2ZD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function obterProdutosCardapio(callback) {
    const produtosRef = collection(db, "produtos");
    onSnapshot(produtosRef, snapshot => {
        const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(produtos);
    });
}

export async function atualizarEstoque(id, novaQuantidade) {
    await updateDoc(doc(db, "produtos", id), { quantidade: novaQuantidade });
}
