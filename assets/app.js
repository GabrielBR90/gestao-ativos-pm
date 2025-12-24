import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// ✅ Cole aqui seu firebaseConfig (do projeto certo)
const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Helpers
function setMsg(el, text, ok){
  if (!el) return;
  el.textContent = text || "";
  el.className = "msg " + (ok ? "ok" : "err");
}

function friendlyAuthMessage(err){
  const code = (err && err.code) ? String(err.code) : "";
  const msg = (err && err.message) ? String(err.message) : "";

  if (code === "auth/invalid-credential" ||
      code === "auth/invalid-login-credentials" ||
      code === "auth/wrong-password" ||
      code === "auth/user-not-found") {
    return "Login ou senha erradas.";
  }
  if (code === "auth/too-many-requests") return "Muitas tentativas. Aguarde e tente novamente.";
  if (code === "auth/network-request-failed") return "Falha de rede. Verifique sua conexão.";
  if (code === "auth/invalid-email") return "E-mail inválido.";

  // fallback
  return msg || "Falha ao autenticar.";
}

// ====== LOGIN (index.html) ======
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
      // redireciona para área restrita
      window.location.href = "./app.html";
    } catch (err) {
      setMsg(msg, friendlyAuthMessage(err), false);
    } finally {
      btnEntrar.disabled = false;
    }
  });
}

// ====== APP (app.html) ======
const btnSair = document.getElementById("btnSair");
if (btnSair) {
  btnSair.addEventListener("click", async () => {
    try { await signOut(auth); } catch(e) {}
    window.location.href = "./index.html";
  });
}

// ====== PROTEÇÃO DE ROTAS ======
onAuthStateChanged(auth, (user) => {
  const path = (window.location.pathname || "").toLowerCase();

  const isIndex = path.endsWith("/") || path.endsWith("/index.html");
  const isApp = path.endsWith("/app.html");

  if (isApp && !user) {
    // tentando abrir área restrita sem login
    window.location.replace("./index.html");
  }

  if (isIndex && user) {
    // já está logado, vai direto pro app
    // (opcional, mas fica bem)
    // window.location.replace("./app.html");
  }
});
