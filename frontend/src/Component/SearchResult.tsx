import { useLocation } from "react-router-dom";
import { Book } from "../types/book.type";
import BookItemCart from "./BookItemCart";

export default function SearchResult() {
  const location = useLocation();
  const book = (location.state as Book[]) || [];

  return (
    <>
      <div className="mx-3 flex flex-wrap">
        {book.map((post) => (
          <BookItemCart key={post.id} data={post} />
        ))}
      </div>
    </>
  );
}
