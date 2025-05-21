import { Outlet } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";

export default function App() {
    return (
        <div className="font-serif">
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
            />
            <Outlet />
        </div>
    );
}
