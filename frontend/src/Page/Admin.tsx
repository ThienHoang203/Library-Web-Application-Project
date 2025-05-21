import { useCallback, useContext, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Register from "./Register";
import CreateNewBook from "../Component/CreateNewBook";
import { UserContext } from "../global-states/UserContext";

export default function Admin() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const { user } = useContext(UserContext);

  const setShowFormFalse = useCallback(() => {
    setShowForm(false);
  }, []);

  const setShowBookFormFalse = useCallback(() => {
    setShowBookForm(false);
  }, []);

  if (!user || !user?.role || user.role !== "admin")
    return <Navigate to={"/"} />;

  return (
    <div className="flex">
      <div className="bg-blue-500 w-[380px] h-screen">
        <div className="w-full px-6">
          <p
            className="text-3xl cursor-pointer font-medium h-[80px] text-white text-center border-b-3 p-5 border-[rgba(255,255,255,0.3)]"
            onClick={() => navigate("/")}
          >
            MyLibrary
          </p>
        </div>
        <div className="w-full px-16">
          <p className="text-2xl font-medium h-[80px] text-[rgba(255,255,255,0.8)] text-center border-b-3 p-5 border-[rgba(255,255,255,0.3)]">
            DashBoard
          </p>
          <p
            className="text-center cursor-pointer  p-2 mt-3 hover:bg-blue-400 rounded text-[18px] font-medium text-[rgba(255,255,255,0.8)]"
            onClick={() => navigate("/admin/users")}
          >
            User
          </p>
          <p
            className="text-center  cursor-pointer  p-2 mt-3 hover:bg-blue-400 rounded text-[18px] font-medium text-[rgba(255,255,255,0.8)]"
            onClick={() => navigate("/admin/books")}
          >
            Book
          </p>
        </div>
      </div>

      <div className="bg-white w-full h-screen flex flex-col px-5">
        <div className="w-full h-[80px] bg-white border-b-3 border-[rgba(0,0,0,0.4)] flex justify-between">
          <div className="h-[70px] w-[440px]">
            <button
              onClick={() => setShowBookForm(true)}
              className="px-3 bg-blue-500 mt-4 ml-10 p-2 rounded border-2 cursor-pointer text-white hover:text-blue-500 hover:bg-white hover:boder-blue-500"
            >
              Add Book
            </button>
            <button
              className="px-3 bg-blue-500 mt-4 ml-10 p-2 rounded border-2 cursor-pointer text-white hover:text-blue-500 hover:bg-white hover:boder-blue-500"
              onClick={() => setShowForm(!showForm)}
            >
              Add New Admin
            </button>
          </div>
          <div
            className=" h-[70px] flex-row-reverse pt-5 flex p-2 text-black font-medium text-2xl hover:cursor-pointer hover:text-[#ccb552]"
            onClick={() => navigate(`/user`)}
          >
           <i className="fa-solid fa-user ml-3 pt-1"></i>

            <p className=" pt-1">{user.name}</p>
          </div>
        </div>
        <div className=" w-full overflow-auto bg-white shadow-lg rounded-lg mt-5">
          <Outlet />
        </div>
      </div>

      <div>
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center  text-center">
            <Register
              endPoint="auth/signup/admin"
              closeFunction={setShowFormFalse}
            />
          </div>
        )}
      </div>
      <div>
        {showBookForm && (
          <div className="fixed inset-0 flex items-center justify-center  text-center">
            <CreateNewBook
              endPoint="book"
              closeFunction={setShowBookFormFalse}
            />
          </div>
        )}
      </div>
    </div>
  );
}
