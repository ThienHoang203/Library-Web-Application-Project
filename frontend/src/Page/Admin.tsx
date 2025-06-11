import { useContext, useRef, useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../global-states/UserContext";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const contentRef = useRef(null);

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

          <div className="w-64 p-4 my-2">
            <div
              onClick={() => setIsUserOpen(!isUserOpen)}
              className="flex items-center justify-between text-white cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-user h-5 w-5 transform transition-transform duration-200 mt-1 "></i>
                <span className="font-medium">USER</span>
              </div>
              <i className="fa-solid fa-angle-down"></i>
            </div>

            <div
              ref={contentRef}
              className={`transition-all duration-200 overflow-hidden ${
                isUserOpen ? "max-h-100" : "max-h-0"
              }`}
            >
              <div className="mt-3 bg-white text-gray-800 rounded-lg p-5 ">
                <ul className="">
                  <li className="w-full py-2">
                    <NavLink
                      to={"/admin/users"}
                      className={({ isActive }) =>
                        `py-2 pr-15 pl-2 rounded-[5px] ${
                          isActive
                            ? " bg-gradient-to-l from-emerald-500 to-emerald-500"
                            : ""
                        }`
                      }
                    >
                      Show User List
                    </NavLink>
                  </li>
                  <li className="w-full py-2">
                    <NavLink
                      to={"/admin/adduser"}
                      className={({ isActive }) =>
                        `py-2 pr-21 pl-2 rounded-[5px] ${
                          isActive
                            ? " bg-gradient-to-l from-emerald-500 to-emerald-500"
                            : ""
                        }`
                      }
                    >
                      Add Admin
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-64 p-4 my-2">
            <div
              onClick={() => setIsBookOpen(!isBookOpen)}
              className="flex items-center justify-between text-white cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-book h-5 w-5 transform transition-transform duration-200 mt-1 "></i>
                <span className="font-medium">BOOK</span>
              </div>
              <i className="fa-solid fa-angle-down"></i>
            </div>

            <div
              ref={contentRef}
              className={`transition-all duration-200 overflow-hidden ${
                isBookOpen ? "max-h-100" : "max-h-0"
              }`}
            >
              <div className="mt-3 bg-white text-gray-800 rounded-lg p-5 ">
                <ul className="">
                  <li className="w-full py-2">
                    <NavLink
                      to={"/admin/books"}
                      className={({ isActive }) =>
                        `py-2 pr-16 pl-2 rounded-[5px] ${
                          isActive
                            ? " bg-gradient-to-l from-emerald-500 to-emerald-500"
                            : ""
                        }`
                      }
                    >
                      Show Book List
                    </NavLink>
                  </li>
                  <li className="w-full py-2">
                    <NavLink
                      to={"/admin/addbook"}
                      className={({ isActive }) =>
                        ` py-2 pr-25 pl-2 rounded-[5px] ${
                          isActive
                            ? " bg-gradient-to-l from-emerald-500 to-emerald-500"
                            : ""
                        }`
                      }
                    >
                      Add Book
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-64 p-4 ">
            <NavLink
              to={"/admin/borrow"}
              className={({ isActive }) =>
                ` pr-15  rounded-[5px] ${
                  isActive
                    ? ""
                    : ""
                }`
              }
            >
              <div
                className="flex items-center justify-between text-white cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <i className="fa-solid fa-right-left  transform transition-transform duration-200  "></i>
                  <span className="font-medium">BORROW TRANSACTION</span>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      <div className="bg-white w-full h-screen flex flex-col px-5">
        <div className="w-full h-[80px] bg-white border-b-3 border-[rgba(0,0,0,0.4)] justify-end">
          <div
            className=" h-[70px] flex-row-reverse pt-5 flex p-2 text-black font-medium text-2xl hover:cursor-pointer hover:text-[#ccb552]"
            onClick={() => navigate(`/user`)}
          >
            <i className="fa-solid fa-user ml-3 pt-1"></i>

            <p className=" pt-1">{user.name}</p>
          </div>
        </div>
        <div className=" w-full overflow-auto rounded-lg  p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
