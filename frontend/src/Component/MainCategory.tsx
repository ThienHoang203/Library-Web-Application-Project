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
    viewBook(decodeURIComponent(data.coverImageFilename), "").then(
      (response) => {
        if (response.status !== HttpStatusCode.Ok)
          throw new Error("Failed to fetch PDF");

        const blob = new Blob([response.data], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);

        setCoverImageLink(url);
      }
    );
  }, []);
  return (
    <div className="w-[250px] p-4 m-2 my-2 mx-7.5">
       <Link to={"/"}>
      <div className=" hover:shadow-[0px_0px_20px_rgba(0,0,0,1)] rounded-b-2xl border">
        <img
          src={coverImageLink === "" ? defaultCoverImage : coverImageLink}
          alt="Pool"
          loading="lazy"
          className=" w-full h-[250px]"
        />
        <p className="line-clamp-2 font-medium h-[65px] py-2  px-3 text-[18px]">
          {data.title}
        </p>
        <p className="line-clamp-2 text-[#808080] px-3 font-medium text-[14px] h-[67px]">
          {data.author}
        </p>
        <div className="bg-[#7f7f7f] w-[70%] mb-5 py-2 mx-auto font-bold rounded text-white hover:text-black hover:cursor-pointer">
          <span>
            <a href="#">ĐỌC NGAY</a>
          </span>
        </div>
      </div>
      </Link>
    </div>
  );
}
