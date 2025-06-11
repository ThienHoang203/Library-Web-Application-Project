import Category from "../Component/MainCategory";
import { useEffect, useState } from "react";
import { searchBooks } from "../Data/Api";
import { Book } from "../types/book.type";

export default function Home() {
  const [items, setItems] = useState<Book[]>([]);

  useEffect(() => {
    searchBooks("/books/search", {query: ""}).then((d) => {
      if (d !== null) {
        setItems(Array.isArray(d) ? d.slice(0, 4) : []);
      }
    });
  }, []);
  return (
    <div className="">
      <div className="max-w-screen-xl px-4 mb-10 mx-auto flex">
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
     
      <div className="pt-5 pb-10 ">
        <div className="max-w-screen-xl rounded-2xl p-4 mx-auto flex flex-wrap shadow-[0px_0px_20px_rgba(0,0,0,0.2)]">
          <div className="w-full">
            <h2 className="text-[24px] ml-15 uppercase font-bold relative ">
              Newest
            </h2>
          </div>
          {items.map((post) => (
            <Category data={post} />
            
          ))}
        </div>
      </div>
      <div className="pt-5 pb-10 ">
        <div className="max-w-screen-xl rounded-2xl p-4 mx-auto flex flex-wrap shadow-[0px_0px_20px_rgba(0,0,0,0.2)]">
          <div className="w-full">
            <h2 className="text-[24px] ml-15 uppercase font-bold relative ">
              Top Rating
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
