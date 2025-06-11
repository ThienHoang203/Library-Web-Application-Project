import { useContext, useEffect, useState } from "react";
import { getMyBorrowBook } from "../Data/Api";
import { UserContext } from "../global-states/UserContext";
import { useLocation } from "react-router-dom";
import RentedBook from "./RentedItem";
import { BorrowType } from "../types/borrow.type";

export default function UserRentedBook() {
  const [rentedBook, setRentedBook] = useState<BorrowType[]>([]);
  const { accessToken } = useContext(UserContext);
  const location = useLocation();
  useEffect(() => {
    const params = {
      limit: 100,
      currentPage: 1,
    };
    getMyBorrowBook(accessToken?.token ?? "", params).then((d) => {
    //   if (d !== null) {
    //     setRentedBook(d);
    //   }  
      if (d !== null) {
        setRentedBook(d.filter(item => (item.status !== "canceled"&& item.status !== "returned")));
      }
    });
  }, [location]);

  return (
    <div>
      {rentedBook.map((post) => (
        <RentedBook key={post.id} data={post} />
      ))}
    </div>
  );
}
