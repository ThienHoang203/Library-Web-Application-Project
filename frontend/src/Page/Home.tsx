import Category from "../Component/MainCategory";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { searchBooks } from "../Data/Api";
import { Book } from "../types/book.type";

export default function Home() {
  const [items, setItems] = useState<Book[]>([]);

  const navigate = useNavigate();
  useEffect(() => {
    searchBooks("/book/search", {}).then((d) => {
      if (d !== null) {
        setItems(Array.isArray(d) ? d.slice(0, 4) : []);
      }
    });
  }, []);
  const [searchData, setSearchData] = useState({
    title: "",
    author: "",
    stock: "",
    genre: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/search", { state: searchData });
  };

  return (
    <div className="">
      <div className="max-w-screen-xl px-4 mx-auto flex">
        <div className="w-full m-5 flex">
          <div className="w-[40%] mx-20 items-center my-auto ">
            <h3 className="text-3xl m-2">Welcome to MyLibrary</h3>
            <p className="text-[18px] m-2">
              Discover your favorite book with us !
            </p>
            <a href=""></a>
          </div>
          <div className="w-[30%]">
            <img src="/img/home.jpg" alt="image" className="w-fit" />
          </div>
        </div>
      </div>
      <div className="search-section p-10 text-center mt-10">
        <div className="bg-black max-w-screen-xl px-4 pt-6 pb-9 mx-auto flex flex-wrap rounded-[8px]">
          <div className="w-full">
            <h2 className="text-[26px] text-[#acacac] font-bold relative pb-5 after:content-[''] after:absolute after:w-20 after:h-[3px] after:bg-[#ccb552] after:left-146 after:bottom-5 after:rounded">
              Search
            </h2>
          </div>
          <form
            className="search bg-[#acacac] p-6 mx-auto rounded-xl"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="title"
              value={searchData.title}
              onChange={handleChange}
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
      </div>
      <div className="pt-5 pb-10 text-center">
        <div className="max-w-screen-xl px-4 mx-auto flex flex-wrap">
          <div className="w-full">
            <h2 className="text-[26px] uppercase font-bold relative pb-5 after:content-[''] after:absolute after:w-20 after:h-[3px] after:bg-[#ccb552] after:left-146 after:bottom-3 after:rounded">
              Top
            </h2>
          </div>
          {items.map((post) => (
            <Category data={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
