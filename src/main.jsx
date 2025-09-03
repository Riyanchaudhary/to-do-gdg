import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Auth0Provider
    domain="dev-enthd3om814sf1s2.us.auth0.com"
    clientId="JCLZBRADDncAaU8HzjWFGfbNgog7cq73"
    authorizationParams={{
      redirect_uri: "http://localhost:5174/",
    }}
  >
    <App />
  </Auth0Provider>
);
