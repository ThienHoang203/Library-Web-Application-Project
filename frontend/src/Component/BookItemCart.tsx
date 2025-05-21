import { Link } from "react-router-dom";
import { Book } from "../types/book.type";
import { useEffect, useState } from "react";
import { viewBook } from "../Data/Api";
import { HttpStatusCode } from "axios";
import defaultCoverImage from "/vite.svg";

type Props = {
    data: Book;
};

export default function BookItemCart({ data }: Props) {
    const [coverImageLink, setCoverImageLink] = useState("");
    useEffect(() => {
        viewBook(decodeURIComponent(data.coverImageFilename), "").then((response) => {
            if (response.status !== HttpStatusCode.Ok) throw new Error("Failed to fetch PDF");

            const blob = new Blob([response.data], { type: "application/pdf" });

            const url = URL.createObjectURL(blob);
            console.log({ url });

            setCoverImageLink(url);
        });
    }, []);

    return (
        <div className="w-[200px] m-2 p-4"  key={data.id}>
            <Link to={`${data.id}`}>
                <div className="hover:shadow-[0px_0px_20px_rgba(0,0,0,1)] rounded-b-2xl border hover:cursor-pointer bg-white">
                    <div className="h-[200px]">
                        <img
                            src={coverImageLink === "" ? defaultCoverImage : coverImageLink}
                            alt="Pool"
                            loading="lazy"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="px-2 py-3">
                        <h5 className="line-clamp-2 h-[50px] font-medium">{data.title}</h5>
                        <p className="line-clamp-3 h-[50px] text-[#acacac]">{data.author}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
