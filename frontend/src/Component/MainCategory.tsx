import { useEffect, useState } from "react";
import { viewBook } from "../Data/Api";
import { Book } from "../types/book.type";
import { HttpStatusCode } from "axios";
import defaultCoverImage from "/vite.svg";
import { Link } from "react-router-dom";

type Props = {
    data: Book;
};

export default function Category({ data }: Props) {
    const [coverImageLink, setCoverImageLink] = useState("");

    useEffect(() => {
        viewBook(decodeURIComponent(data.coverImageFilename)).then((response) => {
            if (response.status !== HttpStatusCode.Ok) throw new Error("Failed to fetch PDF");

            const blob = new Blob([response.data], { type: "application/pdf" });

            const url = URL.createObjectURL(blob);

            setCoverImageLink(url);
        });
    }, []);
    return (
        <div className="w-[250px] p-4 m-2 my-2 mx-7.5" key={data.id}>
            <Link to={`/search/${data.id}`}>
                <div className=" hover:shadow-[0px_0px_10px_rgba(0,0,0,1)] rounded shadow-[0px_0px_20px_rgba(0,0,0,0.2)]">
                    <img
                        // src={coverImageLink === "" ? defaultCoverImage : coverImageLink}
                        src={`http://localhost:5050/public/images/book-covers/${data.coverImageFilename}`}
                        alt="Pool"
                        loading="lazy"
                        className=" w-full h-[250px] rounded-t"
                    />
                    <p className="line-clamp-1 font-medium pt-2  px-3 text-[18px]">{data.title}</p>
                    <p className="line-clamp-1 text-[#808080] pt-1 px-3 font-medium text-[14px] ">{data.author}</p>
                    <p className="  pt-2 px-3 pb-3 font-medium text-[14px] ">
                        <span className="bg-[#cdcdcd] py-1 px-3 rounded">
                            <i className="fas fa-star text-yellow-300 pr-1"></i>rating: {parseFloat(data.avgRating)}
                        </span>
                    </p>
                </div>
            </Link>
        </div>
    );
}
