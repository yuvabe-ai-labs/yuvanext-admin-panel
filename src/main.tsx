import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import ReactDOM from "react-dom/client";

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
