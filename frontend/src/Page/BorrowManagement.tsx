import { useContext, useEffect, useState } from "react";
import { BorrowType } from "../types/borrow.type";
import {
  acceptBorrow,
  deleteBorrow,
  getAllBorrows,
  returnBorrow,
} from "../Data/Api";
import { toast } from "react-toastify";
import { UserContext } from "../global-states/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function BorrowManagement() {
  const [borrows, setBorrows] = useState<BorrowType[]>([]);
  const { accessToken } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    getAllBorrows(accessToken?.token ?? "").then((data) => {
      if (data) setBorrows(data);
    });
  }, [location]);

  const handleAccept = async (id: number) => {
    toast.promise(
      acceptBorrow(accessToken?.token ?? "", id).then(() => {
        navigate("/admin/borrow", { state: "" });
      }),
      {
        pending: "Accepting...",
        success: "Accepted successfully!",
        error: "Failed to accept",
      }
    );
  };

  const handleReturn = async (id: number) => {
    toast.promise(
      returnBorrow(accessToken?.token ?? "", id).then(() => {
        navigate("/admin/borrow", { state: "" });
      }),
      {
        pending: "Returning...",
        success: "Returned successfully!",
        error: "Failed to return",
      }
    );
  };
  const handleDelete = async (id: number) => {
    toast.promise(
      deleteBorrow(accessToken?.token ?? "", id).then(() => {
        navigate("/admin/borrow", { state: "" });
      }),
      {
        pending: "Returning...",
        success: "Returned successfully!",
        error: "Failed to return",
      }
    );
  };

  return (
    <table className="w-full border-collapse">
      <thead className="bg-gray-800 text-white">
        <tr className="[&>th]:p-4 [&>th]:border [&>th]:border-gray-700 text-left">
          <th>#</th>
          <th>User</th>
          <th>Book</th>
          <th>Borrowed At</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Function</th>
        </tr>
      </thead>
      <tbody className="[&>tr]:even:bg-gray-300 [&>tr]:odd:bg-gray-100 [&>tr>*]:p-4  [&>tr>*]:border  [&>tr>*]:border-gray-500   ">
        {borrows.map((borrow, index) => (
          <tr key={borrow.id} className="">
            <td>{index + 1}</td>
            <td>{borrow.user.name}</td>
            <td>{borrow.book.title}</td>
            <td>{new Date(borrow.borrowedAt).toLocaleDateString("vi-VN")}</td>
            <td>{new Date(borrow.dueDate).toLocaleDateString("vi-VN")}</td>
            <td>{borrow.status}</td>
            <td className="flex ">
              {borrow.status === "waiting" && (
                <button
                  onClick={() => handleAccept(borrow.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Accept
                </button>
              )}
              {borrow.status === "borrowing" && (
                <button
                  onClick={() => handleReturn(borrow.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Return
                </button>
              )}
              {(borrow.status === "returned" ||
                borrow.status === "canceled") && (
                <button
                  onClick={() => handleDelete(borrow.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
