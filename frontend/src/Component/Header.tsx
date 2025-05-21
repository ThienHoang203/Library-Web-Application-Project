import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";


import { UserContext } from "../global-states/UserContext";
import { toast } from "react-toastify";

export default function Header() {
  const navigate = useNavigate();
  

  const { user, dispatch } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigate("/", { relative: "route" });
    toast.success("Đăng xuất thành công", { autoClose: 500 });
  };

  const handleHome = () => {
    navigate("/", {});
  };

  return (
      <header className="bg-black p-2 sticky z-1000 top-0 h-[80px] w-full">
        <div className="max-w-screen-xl px-5 mx-auto flex justify-between">
          <div
            className="flex w-[90px] h-[60px] mt-1 cursor-pointer "
            onClick={handleHome}
          >
            <img
              src="img/logo.png"
              alt="library"
              loading="lazy"
              className="w-full h-full "
            />
            <p className="text-[#acacac]   mt-2 text-3xl font-medium hover:text-[#ccb552]">
              MyLibrary
            </p>
          </div>


          <nav className="flex items-center uppercase ">
                <NavLink
                    to={"/"}
                    className={({ isActive }) => `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`}
                >
                    <i className=" fa-solid fa-house text-[#CBA6F7] text-[14px]"></i>
                    <span className=" pr-5 pl-2 text-[#acacac] font-bold ">Home</span>
                </NavLink>

                <NavLink
                    to={"/category"}
                    className={({ isActive }) => `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`}
                >
                    <i className="fa-solid fa-rectangle-list text-[#CBA6F7] text-[14px]"></i>
                    <span className=" pr-5 pl-2 text-[#acacac] font-bold ">Category</span>
                </NavLink>

                <NavLink
                    to={"/search"}
                    className={({ isActive }) => `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`}
                >
                    <i className="fa-solid fa-book text-[#CBA6F7] text-[14px]"></i>
                    <span className="pr-5 pl-2 text-[#acacac] font-bold ">Books</span>
                </NavLink>
                <NavLink
                    to={"/search"}
                    className={({ isActive }) => `inline-block relative ${isActive ? "[&>span]:text-[#CBA6F7]" : ""}`}
                >
                    <i className="fa-solid fa-magnifying-glass text-[#CBA6F7] text-[14px]"></i>
                    <span className="pr-5 pl-2 text-[#acacac] font-bold ">About Us</span>
                </NavLink>
            </nav>



          <div className="">
            {user ? (
              <div className="group">
                <div className="relative group flex-row-reverse text-[20px] flex p-4 text-white font-medium text-2xl hover:cursor-pointer hover:text-[#ccb552]">
                  <i className="fa-solid fa-user ml-3 pt-1"></i>

                  <p className="">{user.name}</p>
                  <div className="z-2000 absolute rounded-xl bg-[#2b3137] border-2 border-white text-white  top-14  w-40  p-2 hidden group-hover:block text-center">
                    <Link to={"/user"} relative="path">
                      <span className=" py-1  p-9 rounded font-medium hover:bg-white hover:text-black cursor-pointer">
                        Profile
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="py-1  p-8 rounded font-medium hover:bg-white hover:text-black cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p
                className=" flex m-2 py-2 px-3 text-black font-medium text-xl hover:bg-white cursor-pointer  bg-[#ccb552] hover:border-[#ccb552] border-2 rounded"
                onClick={() => navigate("/loginPage")}
              >
                Sign In
              </p>
            )}
          </div>
        </div>
      </header>
  );
}
