import { Outlet, useNavigate } from "react-router-dom";
import { BookFormat, BookGerne, BookSortType } from "../types/book.type";
import { useEffect, useRef, useState } from "react";
import { Filter } from "../Data/Api";

export default function SideMenu() {
    const category = Object.entries(BookGerne);
    const formata = Object.entries(BookFormat);
    const order = Object.entries(BookSortType);
    const navigate = useNavigate();
    const isFirst = useRef(true);
    const [filter, setFilter] = useState({
        format: "",
        genre: "",
        sortBy: "",
        sortOrder: ""
    });
    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }
        const query = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
            if (value) query.append(key, value);
        });
        Filter(`books/filter?${query.toString()}`).then((d) => {
            navigate("/search", { state: d });
        });
    }, [filter, navigate]);
    return (
        <div className="overflow-hidden text-center">
            <div className="w-screen flex flex-wrap mt-15">
                <div className="w-screen flex">
                    <div className="w-[25%]  h-fit rounded-2xl shadow-[0px_0px_10px_rgba(0,0,0,0.2)] ml-5 font-medium p-6">
                        <div className="relative mt-4 pt-5">
                            <select
                                defaultValue={""}
                                onChange={(e) => setFilter((prev) => ({ ...prev, format: e.target.value }))}
                                id="format"
                                className=" w-full h-full outline-none pt-2 pr-11 pl-2 pb-2 font-medium border-2 rounded"
                            >
                                <option value="">--------</option>
                                {formata.map((item, index) => (
                                    <option key={index} value={item[1]}>
                                        {item[0]}
                                    </option>
                                ))}
                            </select>

                            <label
                                htmlFor="format"
                                className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
                            >
                                Format
                            </label>
                        </div>

                        <div className="relative mt-4 pt-5">
                            <select
                                defaultValue={""}
                                id="genre"
                                onChange={(e) => setFilter((prev) => ({ ...prev, genre: e.target.value }))}
                                className=" w-full h-full outline-none pt-2 pr-10 pl-2 pb-2 font-medium border-2 rounded"
                            >
                                <option value="">--------</option>

                                {category.map((item, index) => (
                                    <option key={index} value={item[1]}>
                                        {item[0]}
                                    </option>
                                ))}
                            </select>

                            <label
                                htmlFor="genre"
                                className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
                            >
                                Genre
                            </label>
                        </div>
                        <div className="relative mt-4 pt-5">
                            <select
                                defaultValue={""}
                                onChange={(e) => setFilter((prev) => ({ ...prev, sortBy: e.target.value }))}
                                id="SortBy"
                                className=" w-full h-full outline-none pt-2 pr-10 pl-2 pb-2 font-medium border-2 rounded"
                            >
                                <option value="">--------</option>

                                {order.map((item, index) => (
                                    <option key={index} value={item[1]}>
                                        {item[0]}
                                    </option>
                                ))}
                            </select>

                            <label
                                htmlFor="SortBy"
                                className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
                            >
                                Sort Type
                            </label>
                        </div>
                        <div className="relative mt-4 pt-5">
                            <select
                                defaultValue={""}
                                id="SortOrder"
                                onChange={(e) => setFilter((prev) => ({ ...prev, sortOrder: e.target.value }))}
                                className=" w-full h-full outline-none pt-2 pr-10 pl-2 pb-2 font-medium border-2 rounded"
                            >
                                <option key={0} value="desc">
                                    DECREASE
                                </option>
                                <option key={1} value="asc">
                                    INCREASE
                                </option>
                            </select>

                            <label
                                htmlFor="SortOrder"
                                className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
                            >
                                Sort Order
                            </label>
                        </div>
                    </div>
                    <div className="w-[72%] mx-auto ">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
