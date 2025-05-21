import { Outlet, useNavigate } from "react-router-dom";
import { BookGerne } from "../types/book.type";
import { useEffect, useState } from "react";

export default function SideMenu() {
    const navigate = useNavigate();
    const category = Object.values(BookGerne);
    const [searchData, setSearchData] = useState({
        title: "",
        author: "",
        stock: "",
        genre: ""
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchData({ ...searchData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchData.title.trim() === "") {
            setSearchData({
                title: "",
                author: "",
                stock: "",
                genre: ""
            });

            navigate("/search", { state: {} });
        } else {
            navigate("/search", { state: searchData });
            setSearchData((prev) => ({ ...prev, title: "" }));
        }
    };

    const handleChangeGenre = (post: string) => {
        setSearchData((prev) => ({ ...prev, genre: post }));
    };
    useEffect(() => {
        navigate("/search", { state: searchData });
    }, [navigate, searchData]);

    return (
        <div className="overflow-hidden text-center">
            <div className="w-screen flex flex-wrap mt-10">
                <form className="max-w-screen-xl mx-auto mb-15 " onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={searchData.title}
                        onChange={handleChange}
                        className="w-[600px] py-1 px-3  border-3 border-[#ccb552] rounded-2xl text-[20px] outline-none"
                    />
                    <button
                        type="submit"
                        className="ml-5 w-[180px] hover:cursor-pointer py-1 border-3 border-[#ccb552] rounded-2xl text-[20px] font-bold  hover:border-[black] hover:bg-black hover:text-[#ccb552]"
                    >
                        <i className="fa fa-solid fa-magnifying-glass pr-3"></i>
                        Search
                    </button>
                </form>
                <div className="w-screen flex">
                    <div className="w-[25%] sidebar bg-gradient-to-b from-[black] to-[#305da0] text-white font-medium px-5 py-5">
                        <ul className="">
                            {category.map((post) => (
                                <li
                                    key={post}
                                    className="flex hover:cursor-pointer px-6 py-4 hover:bg-[#305da0] rounded-2xl"
                                    onClick={() => handleChangeGenre(post)}
                                >
                                    {post.toUpperCase()}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-[72%] mx-auto bg-gray-200">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
