import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Book } from "../types/book.type";
import { searchBooks } from "../Data/Api";
import BookItemCart from "./BookItemCart";

export default function SearchResult() {
    const [books, setBooks] = useState<Book[]>([]);
    const location = useLocation();
    const searchData = location.state;

    useEffect(() => {
        searchBooks("/book/search", searchData).then((d) => {
            if (d !== null) {
                setBooks(d);
            }
        });
    }, [searchData]);

    return (
        <div className="mx-3 flex flex-wrap">
            {books.map((post) => (
                <BookItemCart key={post.id} data={post} />
            ))}
        </div>
    );
}
