import { useContext, useEffect, useState } from "react";
import { getBookShelf } from "../Data/Api";
import BookItemStorage from "./BookItemStorage";
import { UserContext } from "../global-states/UserContext";
import { BookShelf } from "../types/book-shelf.type";
import { useLocation } from "react-router-dom";

export default function UserStorage() {
  const [bookShelf, setBookShelf] = useState<BookShelf[]>([]);
  const { accessToken } = useContext(UserContext);
  const location = useLocation();
  useEffect(() => {
    getBookShelf(accessToken?.token ?? "").then((d) => {
      if (d !== null) setBookShelf(d);
    });
  }, [location]);

  return (
    <div>
      {bookShelf.map((post) => (
        <BookItemStorage key={post.id} data={post} />
      ))}
    </div>
  );
}
