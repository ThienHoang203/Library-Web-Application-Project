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
import UserStorage from "./Component/UserStorage";
import CreateNewBook from "./Component/CreateNewBook";
import UserRentedBook from "./Component/UserRentedBook";
import BorrowManagement from "./Page/BorrowManagement";
import { useContext, useEffect } from "react";
import { UserContext } from "./global-states/UserContext";
import { getUserProfile } from "./Data/Api";
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
                        element: <User />,
                        children: [
                            {
                                index: true,
                                element: <UserStorage />
                            },
                            {
                                path: "rentedBook",
                                element: <UserRentedBook />
                            },
                            {
                                path: ":bookId",
                                element: <Single />
                            }
                        ]
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
                    },
                    {
                        path: "borrow",
                        element: <BorrowManagement />
                    },
                    {
                        path: "addbook",
                        element: <CreateNewBook endPoint="books" />
                    },
                    {
                        path: "adduser",
                        element: <Register endPoint="auth/signup/admin" />
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
    const { accessToken, dispatch } = useContext(UserContext);
    const storedToken = localStorage.getItem("token");
    useEffect(() => {
        console.log(accessToken);

        if (storedToken) {
            getUserProfile(storedToken)
                .then((d) => {
                    dispatch({ type: "authenticated", user: d });
                    dispatch({ type: "login", token: storedToken });
                })
                .catch((e) => {
                    console.error("Error fetching user profile:", e);
                });
        }
    }, []);
    return <RouterProvider router={router} />;
}
