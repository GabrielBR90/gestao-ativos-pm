import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-t7NgJWtbkhhh9Lsez9L4y_XWdqxqxpk",
  authDomain: "sistemaescala-d8c25.firebaseapp.com",
  projectId: "sistemaescala-d8c25",
  storageBucket: "sistemaescala-d8c25.firebasestorage.app",
  messagingSenderId: "1067432155042",
  appId: "1:1067432155042:web:9ae9d4047180c3197684fb",
  measurementId: "G-0T2B7ZMMM9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function setMsg(el, text, ok){
  if (!el) return;
  el.textContent = text || "";
  el.className = "msg " + (ok ? "ok" : "err");
}

function friendlyAuthMessage(err){
  const code = (err && err.code) ? String(err.code) : "";
  const msg  = (err && err.message) ? String(err.message) : "";

  if (
    code === "auth/invalid-credential" ||
    code === "auth/invalid-login-credentials" ||
    code === "auth/wrong-password" ||
    code === "auth/user-not-found"
  ) return "Login ou senha erradas.";

  if (code === "auth/too-many-requests") return "Muitas tentativas. Aguarde e tente novamente.";
  if (code === "auth/network-request-failed") return "Falha de rede. Verifique sua conexão.";
  if (code === "auth/invalid-email") return "E-mail inválido.";

  return msg || "Falha ao autenticar.";
}

// LOGIN (index.html)
const frmLogin = document.getElementById("frmLogin");
const msg = document.getElementById("msg");
const btnEntrar = document.getElementById("btnEntrar");

if (frmLogin) {
  frmLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    setMsg(msg, "", true);
    btnEntrar.disabled = true;

    const email = (document.getElementById("email").value || "").trim();
    const senha = (document.getElementById("senha").value || "");

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      window.location.href = "./app.html";
    } catch (err) {
      setMsg(msg, friendlyAuthMessage(err), false);
    } finally {
      btnEntrar.disabled = false;
    }
  });
}

// APP (app.html)
const btnSair = document.getElementById("btnSair");
if (btnSair) {
  btnSair.addEventListener("click", async () => {
    try { await signOut(auth); } catch(e) {}
    window.location.href = "./index.html";
  });
}

// PROTEÇÃO (não deixa entrar no app.html sem login)
onAuthStateChanged(auth, (user) => {
  const path = (window.location.pathname || "").toLowerCase();
  const isApp = path.endsWith("/app.html");

  if (isApp && !user) {
    window.location.replace("./index.html");
  }
});
