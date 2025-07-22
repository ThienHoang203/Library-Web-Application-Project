import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../img/logo.png";
import { UserContext } from "../global-states/UserContext";
import { toast } from "react-toastify";
import { searchBooks } from "../Data/Api";
import { Book } from "../types/book.type";

export default function Header() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState(false);
    const { user, dispatch } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [books, setBooks] = useState<Book[]>([]);
    const handleSearch = () => {
        setSearch(!search);
    };
    useEffect(() => {
        inputRef.current?.focus();
    }, [search]);
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        dispatch({ type: "logout" });
        navigate("/", { relative: "route" });
        toast.success("Đăng xuất thành công", { autoClose: 500 });
    };

    const handleHome = () => {
        navigate("/", {});
    };

    ////////////////////////////////////////////////////////////////////Search//////////////////////////////

    useEffect(() => {
        searchBooks("/books/search", { query: title }).then((d) => {
            if (d !== null) setBooks(d);
        });
    }, [title]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/search", { state: books });
    };

    return (
        <header className="bg-black p-2 sticky z-1000 top-0 h-[80px] w-full">
            <div className="max-w-screen-xl px-5 mx-auto flex justify-between">
                <div className="flex w-[90px] h-[60px] mt-1 mr-35  cursor-pointer " onClick={handleHome}>
                    <img src={logo} alt="library" loading="lazy" className="w-full h-full " />
                    <p className="text-[#acacac]   mt-2 text-3xl font-medium hover:text-[#ccb552]">MyLibrary</p>
                </div>

                <nav className="flex items-center uppercase ">
                    <NavLink
                        to={"/"}
                        className={({ isActive }) =>
                            `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`
                        }
                    >
                        <i className=" fa-solid fa-house text-[#CBA6F7] text-[14px]"></i>
                        <span className=" pr-5 pl-2 text-[#acacac] font-bold ">Home</span>
                    </NavLink>

                    <NavLink
                        to={"/category"}
                        className={({ isActive }) =>
                            `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`
                        }
                    >
                        <i className="fa-solid fa-rectangle-list text-[#CBA6F7] text-[14px]"></i>
                        <span className=" pr-5 pl-2 text-[#acacac] font-bold ">Category</span>
                    </NavLink>

                    <NavLink
                        to={"/search"}
                        onClick={handleSubmit}
                        className={({ isActive }) =>
                            `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`
                        }
                    >
                        <i className="fa-solid fa-book text-[#CBA6F7] text-[14px]"></i>
                        <span className="pr-5 pl-2 text-[#acacac] font-bold ">Books</span>
                    </NavLink>
                    <NavLink
                        to={"/search"}
                        className={({ isActive }) =>
                            `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`
                        }
                    >
                        <i className="fa-solid fa-magnifying-glass text-[#CBA6F7] text-[14px]"></i>
                        <span className="pr-5 pl-2 text-[#acacac] font-bold ">About Us</span>
                    </NavLink>
                </nav>

                <div
                    className={
                        search
                            ? "text-[#CBA6F7] text-[20px]  p-4 cursor-pointer"
                            : "text-white text-[20px] p-4 cursor-pointer"
                    }
                    onClick={handleSearch}
                >
                    <i className="fa-solid fa-magnifying-glass "></i>
                </div>

                <div className="">
                    {user ? (
                        <div className="group">
                            <div className="relative group flex-row-reverse text-[20px] flex p-4 text-white font-medium text-2xl hover:cursor-pointer hover:text-[#ccb552]">
                                <i className="fa-solid fa-user ml-3 pt-1"></i>

                                <p className="">{user.name}</p>
                                <div className="z-2000 absolute rounded-xl bg-[#2b3137] border-2 border-white text-white  top-14  w-40  p-2 hidden group-hover:block text-center">
                                    <Link to={"/user"} relative="path">
                                        <span className=" py-1  p-9 rounded font-medium hover:bg-white hover:text-black cursor-pointer">
                                            Profile
                                        </span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="py-1  p-8 rounded font-medium hover:bg-white hover:text-black cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p
                            className=" flex m-2 py-2 px-3 text-black font-medium text-xl hover:bg-white cursor-pointer  bg-[#ccb552] hover:border-[#ccb552] border-2 rounded"
                            onClick={() => navigate("/loginPage")}
                        >
                            Sign In
                        </p>
                    )}
                </div>
            </div>
            {search ? (
                <div className=" text-center pt-2 mx-auto flex flex-wrap ">
                    <form className=" bg-[#acacac] p-6 mx-auto rounded-b-2xl" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-[600px] h-8 px-2 text-[18px] border-3 border-transparent focus:border-[#ccb552] focus:outline-none rounded-[5px] bg-white"
                        />
                        <button
                            type="submit"
                            className="ml-5 w-40 h-8 border-none rounded text-[18px] font-bold bg-gray-200 hover:bg-black hover:text-[#ccb552] hover:cursor-pointer"
                        >
                            <i className="fa fa-solid fa-magnifying-glass pr-2 text-[18px]"></i>
                            Search
                        </button>
                    </form>
                </div>
            ) : (
                ""
            )}
        </header>
    );
}
