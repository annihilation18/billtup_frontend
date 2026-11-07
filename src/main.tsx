import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
// Site design (app repo BACKLOG P4.1): tokens + header/footer/home, then the theme for every other page
import "./styles/billtup-site.css";
import "./styles/billtup-theme.css";

// Suppress verbose console output in production builds
// console.warn and console.error remain active for prod debugging
if (import.meta.env.PROD) {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
