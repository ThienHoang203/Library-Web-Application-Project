import { useContext, useEffect, useState } from "react";
import { UpdateUserForm, User } from "../types/user.type";
import { useForm } from "react-hook-form";
import { UserContext } from "../global-states/UserContext";
import { toast } from "react-toastify";
import { fetchUpdateUserInfor } from "../Data/Api";
import { AxiosError } from "axios";
import ErrorFormMessage from "./ErrorFormMessage";

type Props = {
    user: User;
    closeForm: () => void;
};

export default function UpdateUserInfor({ user, closeForm }: Props) {
    const [step, setStep] = useState(1);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<UpdateUserForm>();

    const { accessToken } = useContext(UserContext);

    async function onSubmit(data: UpdateUserForm) {
        toast.promise(
            fetchUpdateUserInfor(data, accessToken?.token ?? "").then(() => {
                setTimeout(() => {
                    closeForm();
                    window.location.reload();
                }, 500);
            }),
            {
                pending: "Đang thực hiện thay đổi mật khẩu...",
                success: {
                    delay: 500,
                    render: "Thay đổi thông tin user thành công"
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
                            return "Thay đổi thông tin user không thành công!";
                        }
                    }
                }
            }
        );
    }

    useEffect(() => {
        const { birthDate, email, phoneNumber, name } = user;
        setValue("birthDate", birthDate);
        setValue("email", email);
        setValue("phoneNumber", phoneNumber);
        setValue("name", name);
    }, []);

    return (
        <div className="fixed top-1/2 left-4/6 transform -translate-x-1/2 -translate-y-1/2  z-20 rounded-md bg-white shadow-[0px_0px_20px_rgba(0,0,0,1)]">
            <button
                className="text-gray-400 font-semibold cursor-pointer hover:text-red-500 hover:scale-125 transition:scale duration-300 ease-in-out ml-3 mt-2"
                onClick={closeForm}
            >
                X
            </button>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-[1fr_1fr] gap-5 px-10 w-full">
                <div className=" w-full flex flex-col">
                    <div className="relative ">
                        <input
                            id="name"
                            type="text"
                            placeholder=""
                            className="h-full w-full outline-none peer border  rounded-md p-3"
                            {...register("name")}
                        />
                        <label
                            htmlFor="name"
                            className="
                            bg-white
                            font-medium text-md text-gray-500 absolute left-2 transition-all duration-300 ease-in-out 
                            peer-placeholder-shown:top-1/5 peer-placeholder-shown:text-md  
                            peer-[:not(:placeholder-shown)]:-top-1/4 peer-[:not(:placeholder-shown)]:text-sm   peer-[:not(:placeholder-shown)]:text-blue-500
                            peer-focus:-top-1/4 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Name
                        </label>
                    </div>
                    {errors.name && <ErrorFormMessage message={errors.name.message} />}
                </div>

                <div className=" w-full flex flex-col">
                    <div className="relative ">
                        <input
                            id="email"
                            type="text"
                            placeholder=""
                            className="h-full w-full outline-none peer border  rounded-md p-3"
                            {...register("email")}
                        />
                        <label
                            htmlFor="email"
                            className="
                            bg-white
                            font-medium text-md text-gray-500 absolute left-2 transition-all duration-300 ease-in-out 
                            peer-placeholder-shown:top-1/5 peer-placeholder-shown:text-md  
                            peer-[:not(:placeholder-shown)]:-top-1/4 peer-[:not(:placeholder-shown)]:text-sm   peer-[:not(:placeholder-shown)]:text-blue-500
                            peer-focus:-top-1/4 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Email
                        </label>
                    </div>
                    {errors.email && <ErrorFormMessage message={errors.email.message} />}
                </div>

                <div className=" w-full flex flex-col">
                    <div className="relative ">
                        <input
                            id="phoneNumber"
                            type="text"
                            placeholder=""
                            className="h-full w-full outline-none peer border  rounded-md p-3"
                            {...register("phoneNumber")}
                        />
                        <label
                            htmlFor="phoneNumber"
                            className="
                            bg-white
                            font-medium text-md text-gray-500 absolute left-2 transition-all duration-300 ease-in-out 
                            peer-placeholder-shown:top-1/5 peer-placeholder-shown:text-md  
                            peer-[:not(:placeholder-shown)]:-top-1/4 peer-[:not(:placeholder-shown)]:text-sm   peer-[:not(:placeholder-shown)]:text-blue-500
                            peer-focus:-top-1/4 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Phone number
                        </label>
                    </div>
                    {errors.phoneNumber && <ErrorFormMessage message={errors.phoneNumber.message} />}
                </div>

                <div className=" w-full flex flex-col">
                    <div className="relative ">
                        <input
                            id="birthDate"
                            type="date"
                            placeholder=""
                            className="h-full w-full outline-none peer border  rounded-md p-3"
                            {...register("birthDate")}
                        />
                        <label
                            htmlFor="birthDate"
                            className="
                            bg-white
                            font-medium text-md text-gray-500 absolute left-2 transition-all duration-300 ease-in-out 
                            peer-placeholder-shown:top-1/5 peer-placeholder-shown:text-md  
                            peer-[:not(:placeholder-shown)]:-top-1/4 peer-[:not(:placeholder-shown)]:text-sm   peer-[:not(:placeholder-shown)]:text-blue-500
                            peer-focus:-top-1/4 peer-focus:text-sm peer-focus:text-blue-500"
                        >
                            Birth date
                        </label>
                    </div>
                    {errors.birthDate && <ErrorFormMessage message={errors.birthDate.message} />}
                </div>
                <div className="flex justify-end gap-3 col-span-2">
                    {step === 1 && (
                        <button
                            type="button"
                            className="px-3 py-1 w-fit border transition:color duration-300 ease-in-out font-semibold text-gray-500 border-gray-300 mb-5 rounded-md hover:bg-red-600 hover:text-white text-lg"
                            onClick={() => {
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
