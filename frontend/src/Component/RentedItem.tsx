import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { cancelBorrowBook, viewBook } from "../Data/Api";
import { HttpStatusCode } from "axios";
import defaultCoverImage from "/vite.svg";
import { UserContext } from "../global-states/UserContext";
import { BorrowType } from "../types/borrow.type";

type Props = {
    data: BorrowType;
};

export default function RentedBook({ data }: Props) {
    const [coverImageLink, setCoverImageLink] = useState("");
    const { accessToken } = useContext(UserContext);
    const navigate = useNavigate();
    console.log(data);

    useEffect(() => {
        viewBook(decodeURIComponent(data.book.coverImageFilename)).then((response) => {
            if (response.status !== HttpStatusCode.Ok) throw new Error("Failed to fetch PDF");
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setCoverImageLink(url);
        });
    }, []);
    function handleCancel(id: number) {
        cancelBorrowBook(accessToken?.token ?? "", id).then((result) => {
            navigate("/user/rentedBook", { state: "" });
            console.log(result);
        });
    }
    return (
        <div className="w-full flex text-left p-4  border-b-2 " key={data.book.id}>
            <Link to={`/search/${data.book.id}`} className="w-full">
                <div className=" h-[130px] hover:cursor-pointer rounded flex bg-gray-200">
                    <div className="w-[120px]">
                        <img
                            src={coverImageLink === "" ? defaultCoverImage : coverImageLink}
                            alt="Pool"
                            loading="lazy"
                            className="w-full h-full object-cover rounded"
                        />
                    </div>
                    <div className="mx-5 py-3 w-full">
                        <h5 className=" text-[#7c7c7c] h-[50px]  font-bold">{data.book.title}</h5>
                        <div className="flex text-[#7c7c7c] ">
                            <i className="fa-solid fa-calendar-days mt-1 mx-1 text-blue-500"></i>

                            <p className=" font-bold">{new Date(data.borrowedAt).toLocaleDateString("vi-VN")}</p>
                            <i className="fa-solid fa-arrow-right mt-1 mx-2"></i>
                            <p className=" font-bold">{new Date(data.dueDate).toLocaleDateString("vi-VN")}</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="mt-3 gap-2">
                                <button className="border-2 font-medium border-green-800 text-green-800 py-1 px-2 rounded">
                                    {data.book.genre}
                                </button>
                            </div>
                            <div className="mt-3 gap-2">
                                <button className="border-2 font-medium border-green-800 text-green-800 py-1 px-2 rounded">
                                    {data.book.format}
                                </button>
                            </div>
                            <div className="mt-3 gap-2">
                                <button className="border-2 font-medium border-green-800 text-green-800 py-1 px-2 rounded">
                                    {data.status}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="flex flex-col h-[130px]">
                <button
                    onClick={() => handleCancel(data.id)}
                    className="mt-auto flex items-center gap-2 text-white bg-red-600 font-medium py-1 px-2 rounded  hover:bg-[black] hover:text-[#ccb552] hover:cursor-pointer"
                >
                    <i className="fa-solid fa-ban mt-1"></i> <p>cancel</p>
                </button>
            </div>
        </div>
    );
}
