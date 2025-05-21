import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { getUserProfile, LoginNormal } from "../Data/Api";
import { LoginType } from "../types/auth.type";
import { toast } from "react-toastify";
import { UserContext } from "../global-states/UserContext";

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { dispatch } = useContext(UserContext);
    // const {  } = useCurrentRoute();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginType>({
        mode: "onBlur"
    });

    async function logIn(loginData: LoginType) {
        const accessToken = await LoginNormal("/auth/login", loginData);
        if (!accessToken) {
            console.error("Đăng nhập thất bại");
            return;
        }
        dispatch({ type: "login", token: accessToken.token });
        localStorage.setItem("token", accessToken.token);
        const user = await getUserProfile(accessToken.token);

        dispatch({ type: "authenticated", user: user });
        setTimeout(() => {
            navigate("/", { replace: true });
        }, 500);
    }

    function onSubmit(user: LoginType) {
        toast.promise(logIn(user), {
            pending: {
                render: "Vui lòng chờ xác thực"
            },
            success: {
                render: "Xác thực thành công 👌",
                autoClose: 500
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
                        typeof data.response.data.message !== "string"
                    )
                        return "Đăng nhập không thành công🤯";
                    return data.response.data.message;
                }
            }
        });
    }

    return (
        <div className="text-center wrapper-login mx-auto my-5 relative w-xl border-2 border-black rounded-2xl shadow-[0px_0px_20px_rgba(0,0,0,1)]">
            <h2 className="font-medium text-[35px] pt-10">Login</h2>
            <form action="#" className="pb-12 px-12" onSubmit={handleSubmit(onSubmit)}>
                <div className="relative w-full h-[50px] border-b-2 my-[30px]">
                    <span className=" absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                        id="username"
                        type="text"
                        required
                        className=" w-full h-full outline-none pr-11 pl-2 font-medium"
                        {...register("username", {
                            required: "You must enter your username"
                        })}
                    />
                    {errors.username && <p className="text-red-500 m-2 font-medium">{errors.username.message}</p>}
                    <label
                        htmlFor="username"
                        className="absolute  left-2 font-medium -translate-y-1/2 transition-all top-[-2px] "
                    >
                        User name
                    </label>
                </div>
                <div className="relative w-full h-[50px] border-b-2 my-[30px]">
                    <span className=" icon absolute right-2 text-xl leading-[50px]">
                        {showPassword ? (
                            <i onClick={() => setShowPassword(!showPassword)} className="fa-solid fa-eye"></i>
                        ) : (
                            <i onClick={() => setShowPassword(!showPassword)} className="fa-solid fa-eye-slash"></i>
                        )}
                    </span>
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className=" w-full h-full outline-none pr-11 pl-2 font-medium"
                        {...register("password", {
                            required: "You must enter your password"
                        })}
                    />
                    {errors.password && <p className="text-red-500 m-2 font-medium">{errors.password.message}</p>}
                    <label htmlFor="password" className="absolute  left-2 font-medium -translate-y-1/2 top-[-2px] ">
                        Password
                    </label>
                </div>
                <div className=" font-medium m-5 flex justify-between">
                    <label htmlFor="">
                        <input type="checkbox" className="accent-black mr-2 h-3" /> Remember me
                    </label>
                    <a href="#">Forgot Password</a>
                </div>
                <button
                    type="submit"
                    className="w-full h-[45px] text-white text-xl font-medium bg-black rounded-lg hover:cursor-pointer"
                >
                    {" "}
                    Login
                </button>
                <div className="font-medium mt-6  ">
                    <p>
                        You don't have an account?
                        <Link to="/register">
                            <span className="font-bold ml-2">Register</span>
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
