import { useForm } from "react-hook-form";
import { useContext, useEffect } from "react";
import ErrorFormMessage from "./ErrorFormMessage";
import {   fetchUpdateUser } from "../Data/Api";
import { UserContext } from "../global-states/UserContext";
import { toast } from "react-toastify";
import { RegisterType } from "../types/auth.type";

type Props = {
    setClose: () => void;
};

export default function UpdateUser({ setClose }: Props) {
      const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm<RegisterType>({
        mode: "onBlur",
      });

    const { accessToken, user } = useContext(UserContext);

    function onSubmit(data: RegisterType) {
        fetchUpdateUser(data, accessToken?.token ?? "").then(() => {
            toast.success("Updated");
        });
    }

    useEffect(() => {
            setValue("name", String(user?.name));
            setValue("email", String(user?.email));
            setValue("phoneNumber", String(user?.phoneNumber));
            setValue("birthDate", user?.birthDate);
     
    });

    return (
        <div className="text-center fixed top-40 right-[30%] items-center justify-center  mx-auto my-5  w-xl border-2 bg-white border-black rounded-2xl shadow-[0px_0px_20px_rgba(0,0,0,1)]">
            <button onClick={() => setClose()}  className="absolute right-[50px] top-[10px] text-black font-bold px-3 py-1.5 rounded-md border border-black  hover:cursor-pointer hover:text-white hover:bg-black  transform:hover  duration-300 ease">X</button>
            <h2 className="font-medium text-[25px] pt-3 pb-1">Change User Information</h2>
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
         
                    <button
                      type="submit"
                      className="w-full h-[45px] text-white text-xl font-medium bg-black rounded-lg hover:cursor-pointer"
                    >
                      Change
                    </button>
                  </form>
        </div>
    );
}
