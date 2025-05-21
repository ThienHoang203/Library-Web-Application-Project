import { useForm } from "react-hook-form";
import { BookFormat, BookGerne, CreateBookType } from "../types/book.type";
import { toast } from "react-toastify";
import { fetchCreateBook } from "../Data/Api";
import { AxiosError } from "axios";
import ErrorFormMessage from "./ErrorFormMessage";

type Props = {
    endPoint: string;
    closeFunction?: () => void;
};

// const schema = yup.object<CreateBookType>().shape({
// coverImageFile : yup.mixed().test()
// })

export default function CreateNewBook({ endPoint, closeFunction }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CreateBookType>({
        mode: "onBlur"
    });

    const token = localStorage.getItem("token");

    const onSubmit = (data: CreateBookType) => {
        console.log({ length: data });

        toast.promise(
            fetchCreateBook(endPoint, data, token ?? "").then((data) => {
                if (!data) throw new AxiosError("Tạo mới không thành công");
            }),
            {
                pending: {
                    render: "Đang thêm mới...",
                    autoClose: 500
                },
                success: {
                    render: "Tạo mới thành công👌",
                    autoClose: 1000,
                    delay: 500
                },
                error: {
                    render({ data }) {
                        console.log(data);

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
                            console.log(
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
                            );

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
                    delay: 500
                }
            }
        );
    };

    return (
        <div className="text-center mx-auto relative w-xl border-2 bg-white border-black rounded-2xl shadow-[0px_0px_20px_rgba(0,0,0,1)]">
            {closeFunction && (
                <button
                    onClick={closeFunction}
                    className="absolute right-[50px] top-[20px] text-black font-bold px-3 py-1.5 rounded-md border border-black  hover:cursor-pointer hover:text-white hover:bg-black  transform:hover  duration-300 ease"
                >
                    <span>X</span>
                </button>
            )}

            <h2 className="font-medium text-[25px] pt-3">Add New Book</h2>

            <form
                noValidate
                action="#"
                className="pb-5 px-12 div-form-style"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <input
                        type="text"
                        id="title"
                        required
                        
                                  className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        {...register("title", {
                            required: "You must enter book's title",
                            minLength: { value: 2, message: "Nho3 hon7 2" }
                        })}
                    />
                    {errors.title && <ErrorFormMessage message={errors.title.message} />}
                    <label htmlFor="title" className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] ">
                        Title
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-user"></i>
                    </span>
                    <input
                        type="text"
                        id="author"
                                className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        required
                        {...register("author", {
                            required: "You must enter book's author",
                            maxLength: {
                                value: 50,
                                message: "Tên tác giả không được vượt quá 50 kí tự"
                            }
                        })}
                    />
                    {errors.author && <ErrorFormMessage message={errors.author.message} />}
                    <label htmlFor="author" className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] ">
                        Author
                    </label>
                </div>

                <div>
                    <select
                        defaultValue={""}
                        id="format"
                        required
                                className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        {...register("format", { required: "Vui lòng chọn định dạng sách!" })}
                    >
                        <option disabled value="">
                            Chọn định dạng
                        </option>

                        {Object.values(BookFormat).map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    {errors.format && <ErrorFormMessage message={errors.format.message} />}
                    <label htmlFor="format" className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] ">
                        Format
                    </label>
                </div>

                <div>
                    <select
                        id="genre"
                                className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        required
                        {...register("genre", {
                            setValueAs(value) {
                                if (!value || value === "") return undefined;
                                return String(value);
                            }
                        })}
                        defaultValue={""}
                    >
                        <option disabled value="">
                            Chọn thể loại
                        </option>

                        {Object.values(BookGerne).map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                    {errors.genre && <ErrorFormMessage message={errors.genre.message} />}
                    <label htmlFor="genre" className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] ">
                        Genre
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <input
                        type="text"
                        id="description"
                                className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        required
                        {...register("description", {
                            setValueAs(value) {
                                if (!value || value === "") return undefined;
                                return String(value);
                            }
                        })}
                    />
                    {errors.description && <ErrorFormMessage message={errors.description.message} />}
                    <label htmlFor="description" className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] ">
                        Description
                    </label>
                </div>

                <div>
               
                    <input
                        type="date"
                        id="publishedDate"
                                className=" w-full h-full outline-none pt-3 pr-2 pl-2 font-medium"
                        required
                        {...register("publishedDate", {
                            setValueAs(value) {
                                if (!value || value === "") return undefined;
                                return String(value);
                            }
                        })}
                    />
                    {errors.publishedDate && <ErrorFormMessage message={errors.publishedDate.message} />}
                    <label
                        htmlFor="publishedDate"
                        className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
                    >
                        Published Date
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <input
                        type="text"
                        id="stock"
                         className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        required
                        {...register("stock", {
                            setValueAs(value) {
                                if (!value || value === "") return undefined;
                                return Number(value);
                            },
                            pattern: {
                                value: /^[+]?\d+$/,
                                message: "Chỉ cho phép số nguyên dương"
                            },
                            min: {
                                value: 0,
                                message: "Stock không được nhỏ hơn 0"
                            }
                        })}
                    />
                    {errors.stock && <ErrorFormMessage message={errors.stock.message} />}
                    <label htmlFor="stock" className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] ">
                        Stock
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <input
                        type="text"
                        id="version"
                         className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        {...register("version", {
                            setValueAs(value) {
                                if (!value || value === "") return undefined;
                                return String(value);
                            }
                        })}
                    />
                    {errors.version && <ErrorFormMessage message={errors.version.message} />}
                    <label htmlFor="version" className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] ">
                        Version
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                    </span>
                    <input type="file" id="version" required {...register("ebookFile")} accept=".pdf,.epub"
                     className=" w-full h-full outline-none  pr-11 pt-4 pl-2 font-medium" />
                    {errors.coverImageFile && <ErrorFormMessage message={errors.coverImageFile.message} />}
                    <label
                        htmlFor="coverImageFile"
                        className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
                    >
                        Ebook File
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                    </span>
                    <input type="file" id="version" required {...register("coverImageFile")} accept=".jpg,.jpeg,.png" 
                    className=" w-full h-full outline-none pr-11 pt-4 pl-2 font-medium"/>
                    {errors.coverImageFile && <ErrorFormMessage message={errors.coverImageFile.message} />}
                    <label
                        htmlFor="coverImageFile"
                        className="absolute left-2 font-medium -translate-y-1/3  top-[-2px] "
                    >
                        Cover Image File
                    </label>
                </div>

                <button
                    type="submit"
                    className=" h-[45px] text-white text-xl px-4 font-medium bg-black rounded-lg hover:cursor-pointer"
                >
                    Add book
                </button>
            </form>
        </div>
    );
}
