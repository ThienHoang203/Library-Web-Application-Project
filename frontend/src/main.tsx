import { createRoot } from "react-dom/client";
import "./style.css";
import Route from "./Route";
import UserProvider from "./global-states/UserProvider";

createRoot(document.getElementById("root")!).render(
    <UserProvider>
        <Route />
    </UserProvider>
);
