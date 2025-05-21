import { useState } from "react";
import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { RegisterType } from "../types/auth.type";
import { toast } from "react-toastify";
import { fetchRegisterUser } from "../Data/Api";
import ErrorFormMessage from "../Component/ErrorFormMessage";
type Props = {
  endPoint?: string;
  redirectPage?: string;
  closeFunction?: () => void;
};

export default function Register({
  endPoint,
  redirectPage,
  closeFunction,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterType>({
    mode: "onBlur",
  });

  const onSubmit = (user: RegisterType) => {
    delete user?.confirmPassword;
    if (!endPoint) {
      toast.error("Unsuccessfully!");
      return;
    }
    toast.promise(
      fetchRegisterUser(endPoint, user).then((result) => {
        console.log({ result });

        setTimeout(() => {
          if (redirectPage) navigate(redirectPage);
          // window.location.reload();
        }, 1000);
      }),
      {
        pending: {
          render: "Đang thêm mới...",
          autoClose: 500,
        },
        success: {
          render: "Tạo mới thành công👌",
          autoClose: 500,
          delay: 500,
        },
        error: {
          render({ data }) {
            if (
              !data ||
              typeof data !== "object" ||
              !("response" in data) ||
              typeof data.response !== "object" ||
              data.response === null ||
              !("data" in data.response) ||
              typeof data.response.data !== "object" ||
              data.response.data === null ||
              !("message" in data.response.data) ||
              (typeof data.response.data.message !== "string" &&
                !Array.isArray(data.response.data.message))
            ) {
              return "Tạo mới không thành công🤯";
            }

            return Array.isArray(data.response.data.message) ? (
              <div className="flex flex-col gap-1">
                {data.response.data.message.map((item) => {
                  return Object.entries(item).map(([k, v]) => {
                    return (
                      <p>
                        <span className="font-bold">{k}</span> {`: ${v}\n`}
                      </p>
                    );
                  });
                })}
              </div>
            ) : (
              <p>{data.response.data.message}</p>
            );
          },
          delay: 500,
        },
      }
    );
  };

  const password = watch("password");

  return (
    <div className="text-center wrapper-login mx-auto my-5 relative w-xl border-2 bg-white border-black rounded-2xl shadow-[0px_0px_20px_rgba(0,0,0,1)]">
      {closeFunction && (
        <button
          onClick={closeFunction}
          className="absolute right-[50px] top-[20px] text-black font-bold px-3 py-1.5 rounded-md border border-black  hover:cursor-pointer hover:text-white hover:bg-black  transform:hover  duration-300 ease"
        >
          <span>X</span>
        </button>
      )}

      <h2 className="font-medium text-[35px] pt-5">Register</h2>

      <form
        noValidate
        action="#"
        className="pb-5 px-12"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative w-full h-[50px] border-b-2 my-[20px]">
          <span className="absolute right-2 text-xl leading-[50px]">
            <i className="fa-solid fa-user"></i>
          </span>
          <input
            type="text"
            id="name"
            required
            className=" w-full h-full outline-none pr-11 pl-2 font-medium"
            {...register("name", {
              required: "You must enter your name",
              pattern: {
                value: /^[a-zA-ZÀ-ỹ\s]+$/,
                message: "Tên chỉ chứa kí tự chữ và khoảng trắng",
              },
            })}
          />
          {errors.name && <ErrorFormMessage message={errors.name.message} />}
          <label
            htmlFor="name"
            className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
          >
            Full Name
          </label>
        </div>

        <div className="relative w-full h-[50px] border-b-2 my-[20px]">
          <span className=" absolute right-2 text-xl leading-[50px]">
            <i className="fa-solid fa-envelope"></i>
          </span>
          <input
            id="username"
            type="text"
            required
            className=" w-full h-full outline-none pr-11 pl-2 font-medium"
            {...register("username", {
              required: "You must enter your username",
              pattern: {
                value: /^[a-zA-Z0-9]{1,50}$/,
                message:
                  "Username phải từ 1-50 ký tự và không có ký tự đặc biệt",
              },
            })}
          />
          {errors.username && (
            <ErrorFormMessage message={errors.username.message} />
          )}

          <label
            htmlFor="username"
            className="absolute left-2 font-medium -translate-y-1/3 top-[-2px] "
          >
            User name
          </label>
        </div>

        <div className="relative w-full h-[50px] border-b-2 my-[20px]">
          <span className=" icon absolute right-2 text-xl leading-[50px]">
            {showPassword ? (
              <i
                onClick={() => setShowPassword(!showPassword)}
                className="fa-solid fa-eye"
              ></i>
            ) : (
              <i
                onClick={() => setShowPassword(!showPassword)}
                className="fa-solid fa-eye-slash"
              ></i>
            )}
          </span>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className=" w-full h-full outline-none pr-11 pl-2 font-medium"
            {...register("password", {
              required: "You must enter your password",
              minLength: {
                value: 8,
                message: "Mật khẩu phải có ít nhất 8 kí tự",
              },
            })}
          />
          {errors.password && (
            <ErrorFormMessage message={errors.password.message} />
          )}

          <label
            htmlFor="password"
            className="absolute left-2 font-medium -translate-y-1/3 top-[-2px] "
          >
            Password
          </label>
        </div>

        <div className="relative w-full h-[50px] border-b-2 my-[20px]">
          <span className=" icon absolute right-2 text-xl leading-[50px]">
            {showConfirmPassword ? (
              <i
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="fa-solid fa-eye"
              ></i>
            ) : (
              <i
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="fa-solid fa-eye-slash"
              ></i>
            )}
          </span>
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            required
            className=" w-full h-full outline-none pr-11 pl-2 font-medium"
            {...register("confirmPassword", {
              required: "You must enter your password again",
              validate: (value) =>
                value === password || "passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <ErrorFormMessage message={errors.confirmPassword.message} />
          )}
          <label
            htmlFor="password"
            className="absolute left-2 font-medium -translate-y-1/3 top-[-2px] "
          >
            Confirm Password
          </label>
        </div>

        <div className="relative w-full h-[50px] border-b-2 my-[20px]">
          <span className=" absolute right-2 text-xl leading-[50px]">
            <i className="fa-solid fa-envelope"></i>
          </span>
          <input
            type="email"
            id="email"
            required
            className=" w-full h-full outline-none pr-11 pl-2 font-medium"
            {...register("email", {
              required: "You must enter your email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "không đúng định dạng email!",
              },
            })}
          />
          {errors.email && <ErrorFormMessage message={errors.email.message} />}
          <label
            htmlFor="email"
            className="absolute left-2 font-medium -translate-y-1/3 top-[-2px] "
          >
            Email
          </label>
        </div>

        <div className="relative w-full h-[50px] border-b-2 my-[20px]">
          <span className="absolute right-2 text-xl leading-[50px]">
            <i className="fa-solid fa-phone"></i>
          </span>
          <input
            type="text"
            id="phone"
            required
            className="peer w-full h-full outline-none pr-11 pl-2 font-medium"
            {...register("phoneNumber", {
              required: "You must enter your phone",
              pattern: {
                value:
                  /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
                message: "Số điện thoại phải đúng định dạng!",
              },
              maxLength: {
                value: 10,
                message: "Số điện thoại không được vượt quá 10 kí tự",
              },
              minLength: {
                value: 10,
                message: "Số điện thoại không được ít hơn 10 kí tự",
              },
            })}
          />
          {errors.phoneNumber && (
            <ErrorFormMessage message={errors.phoneNumber.message} />
          )}

          <label
            htmlFor="phone"
            className="absolute left-2 font-medium -translate-y-1/3 top-[-2px] "
          >
            Phone Number
          </label>
        </div>

        <div className="relative w-full h-[50px] border-b-2 my-[20px]">
          <input
            type="date"
            id="birthDate"
            required
            className="peer w-full h-full outline-none pr-2 pl-2 font-medium"
            {...register("birthDate", {
              setValueAs(value) {
                if (!value || value === "") return undefined;
                return String(value);
              },
            })}
          />
          {errors.birthDate && (
            <ErrorFormMessage message={errors.birthDate.message} />
          )}
          <label
            htmlFor="phone"
            className="absolute left-2 font-medium -translate-y-1/3 top-[-2px] "
          >
            Birth Date
          </label>
        </div>
{/* 
        <div className="font-medium m-5 flex justify-between">
          <label htmlFor="">
            <input type="checkbox" className="accent-black mr-2 h-3" /> Agree
            something
          </label>
        </div> */}
        <button
          type="submit"
          className="w-full h-[45px] text-white text-xl font-medium bg-black rounded-lg hover:cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
}
