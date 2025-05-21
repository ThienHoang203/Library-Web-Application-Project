import { useForm } from "react-hook-form";
import { ChangePasswordForm } from "../types/user.type";
import ErrorFormMessage from "./ErrorFormMessage";
import { fetchChangePassword } from "../Data/Api";
import { useContext, useState } from "react";
import { UserContext } from "../global-states/UserContext";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type Props = {
    closeForm: () => void;
};

export default function ChangePassword({ closeForm }: Props) {
    const [step, setStep] = useState(1);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm<ChangePasswordForm>();

    const { accessToken, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    async function onSubmit({ oldPassword, newPassword }: ChangePasswordForm) {
        toast.promise(
            fetchChangePassword(oldPassword, newPassword, accessToken?.token ?? "").then(() => {
                setTimeout(() => {
                    localStorage.removeItem("token");
                    dispatch({ type: "logout" });
                    navigate("/loginPage");
                }, 500);
            }),
            {
                pending: "Đang thực hiện thay đổi mật khẩu...",
                success: {
                    delay: 500,
                    render: "Thay đổi mật khẩu thành công, vui lòng đăng nhập lại."
                },
                error: {
                    delay: 500,
                    render({ data }) {
                        if (
                            data instanceof AxiosError &&
                            data.response &&
                            data.response.data &&
                            data.response.data.message
                        ) {
                            const { message } = data.response.data;

                            if (typeof message === "string") {
                                return message;
                            } else if (Array.isArray(message) && message.length > 0 && typeof message[0] === "object") {
                                const m: string[] = [];
                                message.forEach((item) => {
                                    Object.entries(item).forEach(([k, v]) => {
                                        m.push(`${k}: ${v}`);
                                    });
                                });

                                return (
                                    <div className="flex flex-col gap-2">
                                        {m.map((item) => (
                                            <p>{item}</p>
                                        ))}
                                    </div>
                                );
                            }
                            return "Thay đổi mật khẩu không thành công!";
                        }
                    }
                }
            }
        );
    }

    return (
        <div className="absolute top-1/2 left-4/6 transform -translate-x-1/2 -translate-y-1/2  z-20 rounded-md bg-white shadow-[0px_0px_20px_rgba(0,0,0,1)]">
            <button
                className="text-gray-400 font-semibold cursor-pointer hover:text-red-500 hover:scale-125 transition:scale duration-300 ease-in-out ml-3 mt-2"
                onClick={closeForm}
            >
                X
            </button>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-10 w-sm">
                <div className=" w-full flex flex-col">
                    <div className="relative ">
                        <input
                            id="oldPassword"
                            type="text"
                            placeholder=""
                            className="h-full w-full outline-none peer border  rounded-md p-3"
                            {...register("oldPassword", {
                                required: "Mật khẩu cũ không được để trống"
                            })}
                        />
                        <label
                            htmlFor="oldPassword"
                            className="
                            bg-white
                            font-medium text-md text-gray-500 absolute left-2 transition-all duration-300 ease-in-out 
                            peer-placeholder-shown:top-1/5 peer-placeholder-shown:text-md  
                            peer-[:not(:placeholder-shown)]:-top-1/4 peer-[:not(:placeholder-shown)]:text-sm   peer-[:not(:placeholder-shown)]:text-blue-500
                            peer-focus:-top-1/4 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Old password
                        </label>
                    </div>
                    {errors.oldPassword && <ErrorFormMessage message={errors.oldPassword.message} />}
                </div>

                <div className=" w-full flex flex-col">
                    <div className="relative ">
                        <input
                            id="newPassword"
                            type="text"
                            placeholder=""
                            className="h-full w-full outline-none peer border  rounded-md p-3"
                            {...register("newPassword", {
                                required: "Mật khẩu mới không được để trống"
                            })}
                        />
                        <label
                            htmlFor="newPassword"
                            className="
                            bg-white
                            font-medium text-md text-gray-500 absolute left-2 transition-all duration-300 ease-in-out 
                            peer-placeholder-shown:top-1/5 peer-placeholder-shown:text-md  
                            peer-[:not(:placeholder-shown)]:-top-1/4 peer-[:not(:placeholder-shown)]:text-sm   peer-[:not(:placeholder-shown)]:text-blue-500
                            peer-focus:-top-1/4 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            New password
                        </label>
                    </div>
                    {errors.newPassword && <ErrorFormMessage message={errors.newPassword.message} />}
                </div>

                <div className=" w-full flex flex-col">
                    <div className="relative ">
                        <input
                            id="reConfirmPassword"
                            type="text"
                            placeholder=""
                            className="h-full w-full outline-none peer border  rounded-md p-3"
                            {...register("reConfirmNewPassword", {
                                required: "Nhập lại mật khẩu mới"
                            })}
                        />
                        <label
                            htmlFor="reConfirmPassword"
                            className="
                            bg-white
                            font-medium text-md text-gray-500 absolute left-2 transition-all duration-300 ease-in-out 
                            peer-placeholder-shown:top-1/5 peer-placeholder-shown:text-md  
                            peer-[:not(:placeholder-shown)]:-top-1/4 peer-[:not(:placeholder-shown)]:text-sm   peer-[:not(:placeholder-shown)]:text-blue-500
                            peer-focus:-top-1/4 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Confirm new password
                        </label>
                    </div>
                    {errors.reConfirmNewPassword && <ErrorFormMessage message={errors.reConfirmNewPassword.message} />}
                </div>
                <div className="flex justify-end gap-3">
                    {step === 1 && (
                        <button
                            type="button"
                            className="px-3 py-1 w-fit border transition:color duration-300 ease-in-out font-semibold text-gray-500 border-gray-300 mb-5 rounded-md hover:bg-red-600 hover:text-white text-lg"
                            onClick={() => {
                                if (!watch("oldPassword")) {
                                    setError("oldPassword", { message: "Mật khẩu cũ không được để trống" });
                                    return;
                                } else {
                                    setError("oldPassword", { message: undefined });
                                }
                                if (!watch("newPassword")) {
                                    setError("newPassword", { message: "Mật khẩu mới không được để trống" });
                                    return;
                                } else {
                                    setError("newPassword", { message: undefined });
                                }

                                if (!watch("reConfirmNewPassword")) {
                                    setError("reConfirmNewPassword", {
                                        message: "Xác nhận mật khẩu  không được để trống"
                                    });
                                    return;
                                } else {
                                    setError("reConfirmNewPassword", { message: undefined });
                                }

                                if (watch("newPassword") !== watch("reConfirmNewPassword")) {
                                    setError("reConfirmNewPassword", { message: "Mật khẩu không trùng!" });
                                    return;
                                } else {
                                    setError("reConfirmNewPassword", { message: undefined });
                                }

                                setStep(2);
                            }}
                        >
                            Change
                        </button>
                    )}
                    {step === 2 && (
                        <>
                            <button
                                type="submit"
                                className="px-3 py-1 w-fit border transition:color duration-300 ease-in-out font-semibold text-gray-500 border-gray-300 mb-5 rounded-md hover:bg-blue-600 hover:text-white text-lg"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                type="button"
                                className="px-3 py-1 w-fit border transition:color duration-300 ease-in-out font-semibold text-gray-500 border-gray-300 mb-5 rounded-md hover:bg-red-600 hover:text-white text-lg"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
