import { Link } from "react-router-dom";
import { Book } from "../types/book.type";
import { useEffect, useState } from "react";
import defaultCoverImage from "/vite.svg";

type Props = {
    data: Book;
};

export default function BookItemCart({ data }: Props) {
    const [coverImageLink, setCoverImageLink] = useState("");
    useEffect(() => {
        setCoverImageLink(
            data.coverImageFilename
                ? `${import.meta.env.VITE_BOOK_COVER_IMAGE_URL}/${data.coverImageFilename}`
                : defaultCoverImage
        );
    }, []);

    return (
        <div className="w-[200px] m-2 p-4" key={data.id}>
            <Link to={`${data.id}`}>
                <div className="hover:shadow-[0px_0px_10px_rgba(0,0,0,1)] shadow-[0px_0px_10px_rgba(0,0,0,0.2)] hover:cursor-pointer rounded bg-white">
                    <div className="h-[200px]">
                        <img
                            src={coverImageLink === "" ? defaultCoverImage : coverImageLink}
                            alt="Pool"
                            loading="lazy"
                            className="w-full h-full object-cover rounded-t"
                        />
                    </div>
                    <div className="px-2 py-3">
                        <h5 className="line-clamp-2 h-[50px] font-medium">{data.title}</h5>
                        <p className="line-clamp-1 text-[#acacac]">{data.author}</p>
                        <p className="  pt-2 px-3 pb-3 font-medium text-[14px] ">
                            <span className="bg-[#cdcdcd] py-1 px-3 rounded">
                                <i className="fas fa-star text-yellow-300 pr-1"></i> rating:{" "}
                                {parseFloat(data.avgRating)}
                            </span>
                        </p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
