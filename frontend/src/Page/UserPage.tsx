import { Outlet } from "react-router-dom";
import Footer from "../Component/Footer";
import Header from "../Component/Header";

export default function UserPage() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}
