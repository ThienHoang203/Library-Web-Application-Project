import { NavLink, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-black">
      <div className=" max-w-screen-xl mx-auto px-5  flex">
        <div className="w-[440px] p-4 my-4">
          <img
            src="/img/logo.png"
            alt="library"
            loading="lazy"
            onClick={() => navigate(`/`)}
            className="flex w-[120px] h-[70px] mt-1 cursor-pointer mb-3"
          />

          <div className="text-[#acacac] justify-start gap-2">
            <a
              href="#"
              className="inline-block transition-transform duration-200 hover:text-[#ccb552] hover:scale-125 hover:font-bold"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            &nbsp;
            <a
              href="#"
              className="inline-block transition-transform duration-200 hover:text-[#ccb552] hover:scale-125 hover:font-bold"
            >
              <i className="fa-brands fa-youtube"></i>
            </a>
            &nbsp;
            <a
              href="#"
              className="inline-block transition-transform duration-200 hover:text-[#ccb552] hover:scale-125 hover:font-bold"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>
            &nbsp;
            <a
              href="#"
              className="inline-block transition-transform duration-200 hover:text-[#ccb552] hover:scale-125 hover:font-bold"
            >
              <i className="fa-brands fa-glide"></i>
            </a>
            &nbsp;
            <a
              href="#"
              className="inline-block transition-transform duration-200 hover:text-[#ccb552] hover:scale-125 hover:font-bold"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="w-[440px] p-4 my-4">
          <div className="text-[#acacac]">
            <h2 className="text-[16px] uppercase font-bold relative pb-5 text-left after:content-[''] after:absolute after:w-20 after:h-[3px] after:bg-[#ccb552] after:left-0 after:bottom-[10px] after:rounded">
              functions
            </h2>
            <ul>
              <li>
                <NavLink
                  to={"/"}
                  className="inline-block transition-transform duration-200  hover:scale-125 "
                >
                  <span className=" pr-5 pl-2 text-[#acacac]  hover:text-[#ccb552]">
                    Home
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/category"}
                  className="inline-block transition-transform duration-200  hover:scale-125"
                >
                  <span className=" pr-5 pl-2 text-[#acacac]  hover:text-[#ccb552]">
                    Category
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/search"}
                  className="inline-block transition-transform duration-200  hover:scale-125 "
                >
                  <span className="pr-5 pl-2 text-[#acacac]  hover:text-[#ccb552]">
                    Books
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/search"}
                  className="inline-block transition-transform duration-200  hover:scale-125 "
                >
                  <span className="pr-5 pl-2 text-[#acacac]  hover:text-[#ccb552]">
                    About Us
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-[440px] p-4 my-4">
          <div className="text-[#acacac]">
            <h2 className="text-[16px] uppercase font-bold relative  pb-5 text-left after:content-[''] after:absolute after:w-20 after:h-[3px] after:bg-[#ccb552] after:left-0 after:bottom-[10px] after:rounded">
              More
            </h2>
            <ul className="">
              <li>
                <NavLink
                  to={"/"}
                  className="inline-block transition-transform duration-200  hover:scale-125 "
                >
                  <span className=" pr-5 pl-2 text-[#acacac]  hover:text-[#ccb552]">
                   Privacy Policy
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/category"}
                  className="inline-block transition-transform duration-200  hover:scale-125 "
                >
                  <span className=" pr-5 pl-2 text-[#acacac]  hover:text-[#ccb552]">
                    Term of Use
                  </span>
                </NavLink>
              </li>
              <li>
                <a
                href="https://maps.app.goo.gl/MGRATyJRd6jbWQXY9"
                  className="inline-block transition-transform duration-200  hover:scale-125 "
                >
                  <span className="pr-5 pl-2 text-[#acacac]  hover:text-[#ccb552]">
                   Site Map
                  </span>
                </a>
              </li>
              <li>
           
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#7f7f7f] text-center">
        <p>Copyright &copy; 2025 MyLibrary</p>
      </div>
    </footer>
  );
}
