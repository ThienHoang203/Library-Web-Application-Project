import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { deleteFromBookShelf, viewBook } from "../Data/Api";
import { HttpStatusCode } from "axios";
import defaultCoverImage from "/vite.svg";
import { BookShelf } from "../types/book-shelf.type";
import { UserContext } from "../global-states/UserContext";

type Props = {
  data: BookShelf;
};

export default function BookItemStorage({ data }: Props) {
  const [coverImageLink, setCoverImageLink] = useState("");
  const { accessToken } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    viewBook(decodeURIComponent(data.book.coverImageFilename)).then(
      (response) => {
        if (response.status !== HttpStatusCode.Ok)
          throw new Error("Failed to fetch PDF");
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setCoverImageLink(url);
      }
    );
  }, []);
  function handleDelete(id: number) {
    deleteFromBookShelf(accessToken?.token ?? "", id).then((result) => {
      navigate("/user", { state: "" });
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
            <h5 className=" text-[#7c7c7c] h-[50px]  font-bold">
              {data.book.title}
            </h5>
            <p className=" text-[#7c7c7c]">{data.book.author}</p>
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
            </div>
          </div>
        </div>
      </Link>
      <p
        className="mt-3 text-red-600 cursor-pointer"
        onClick={() => handleDelete(data.id)}
      >
        <i className="fa-solid fa-trash"></i>
      </p>
    </div>
  );
}
