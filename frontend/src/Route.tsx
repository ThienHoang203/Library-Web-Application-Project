import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Page/Home";
import Login from "./Page/Login";
import Error from "./Page/Error";
import SideMenu from "./Component/SideMenu";
import SearchResult from "./Component/SearchResult";
import Single from "./Page/Single";
import User from "./Page/User";
import App from "./Page/App";
import UserManagement from "./Page/UserManagement";
import BookManagement from "./Page/BookManagement";
import Admin from "./Page/Admin";
import Register from "./Page/Register";
import UserPage from "./Page/UserPage";
import PDFViewer from "./Component/PDFViewer";
import { useContext, useEffect } from "react";
import { UserContext } from "./global-states/UserContext";
import { toast } from "react-toastify";
import { getUserProfile } from "./Data/Api";
import { AxiosError, HttpStatusCode } from "axios";
const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "/",
                element: <UserPage />,
                children: [
                    {
                        path: "/",
                        element: <Home />
                    },
                    {
                        path: "loginPage",
                        element: <Login />
                    },
                    {
                        path: "register",
                        element: <Register redirectPage="/" endPoint="auth/signup" />
                    },
                    {
                        path: "user",
                        element: <User />
                    },
                    {
                        path: "search",
                        element: <SideMenu />,
                        children: [
                            {
                                index: true,
                                element: <SearchResult />
                            },
                            {
                                path: ":bookId",
                                element: <Single />
                            }
                        ]
                    },
                    {
                        path: "view/:fileName",
                        element: <PDFViewer />
                    }
                ]
            },
            {
                path: "/admin",
                element: <Admin />,
                children: [
                    {
                        path: "users",
                        element: <UserManagement />
                    },
                    {
                        path: "books",
                        element: <BookManagement />
                    }
                ]
            }
        ]
    },
    {
        path: "*",
        element: <Error />
    }
]);

export default function Routes() {
    const { dispatch } = useContext(UserContext);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            toast.promise(
                getUserProfile(storedToken).then((d) => {
                    dispatch({ type: "authenticated", user: d });
                    dispatch({ type: "login", token: storedToken });
                }),
                {
                    pending: "Vui lòng chờ xác thực",
                    success: {
                        render: "Xác thực thành công 👌",
                        autoClose: 500
                    },
                    error: {
                        render({ data }) {
                            if (data instanceof AxiosError) {
                                console.error({ data: data.response?.data });

                                if (
                                    data.status !== HttpStatusCode.Unauthorized &&
                                    data.response &&
                                    typeof data.response.data === "object" &&
                                    data.response.data.message &&
                                    typeof data.response.data.message === "string"
                                )
                                    return data.response.data.message;
                            }

                            return "Vui lòng đăng nhập lại🤯";
                        },
                        autoClose: 1000
                    }
                }
            );
            dispatch({ type: "login", token: storedToken });
        }
    }, []);
    return <RouterProvider router={router} />;
}
