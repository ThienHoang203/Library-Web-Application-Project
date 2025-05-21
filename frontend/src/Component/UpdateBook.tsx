import { useForm } from "react-hook-form";
import { BookGerne, UpdateBookType } from "../types/book.type";
import { useContext, useEffect } from "react";
import ErrorFormMessage from "./ErrorFormMessage";
import { fetchGetABook, fetchUpdateBook } from "../Data/Api";
import { UserContext } from "../global-states/UserContext";
import { toast } from "react-toastify";

type Props = {
    bookId: number;
    setClose: () => void;
};

export default function UpdateBook({ bookId, setClose }: Props) {
    const {
        register,
        formState: { errors },
        setValue,
        handleSubmit
    } = useForm<UpdateBookType>();

    const { accessToken } = useContext(UserContext);

    function onSubmit(data: UpdateBookType) {
        fetchUpdateBook(data, accessToken?.token ?? "", bookId).then(() => {
            toast.success("Updated");
        });
    }

    useEffect(() => {
        fetchGetABook(bookId).then(({ author, description, genre, publishedDate, version, stock, title }) => {
            setValue("title", title);
            setValue("author", author);
            setValue("description", description);
            setValue("genre", genre);
            setValue("publishedDate", publishedDate);
            setValue("version", Number(version));
            setValue("stock", Number(stock));
        });
    },[]);

    return (
        <div className="border-2 bg-white border-black shadow-[0,0,0,rgba(0,0,0,0.5)] fixed top-[0%] right-[40%] text-center">
            <button onClick={() => setClose()}  className="absolute right-[50px] top-[10px] text-black font-bold px-3 py-1.5 rounded-md border border-black  hover:cursor-pointer hover:text-white hover:bg-black  transform:hover  duration-300 ease">X</button>
            <h2 className="font-medium text-[25px] pt-3 pb-1">Add New Book</h2>
            <form
                noValidate
                action="#"
                className="pb-5 px-12 div-form-style "
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
                    <label htmlFor="title" className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] ">
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
                        required
                         className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        {...register("author", {
                            required: "You must enter book's author",
                            maxLength: {
                                value: 50,
                                message: "Tên tác giả không được vượt quá 50 kí tự"
                            }
                        })}
                    />
                    {errors.author && <ErrorFormMessage message={errors.author.message} />}
                    <label htmlFor="author" className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] ">
                        Author
                    </label>
                </div>

                <div>
                    <select
                        id="genre"
                        required
                         className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
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
                    <label htmlFor="genre" className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] ">
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
                    <label htmlFor="description" className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] ">
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
                        className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] "
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
                        required
                         className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
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
                    <label htmlFor="stock" className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] ">
                        Stock
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <input
                        type="text"
                         className=" w-full h-full outline-none pt-3 pr-11 pl-2 font-medium"
                        id="version"
                        {...register("version", {
                            setValueAs(value) {
                                if (!value || value === "") return undefined;
                                return String(value);
                            }
                        })}
                    />
                    {errors.version && <ErrorFormMessage message={errors.version.message} />}
                    <label htmlFor="version" className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] ">
                        Version
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                    </span>
                    <input type="file" id="version" required {...register("ebookFile")} accept=".pdf,.epub"
                    className=" w-full h-full outline-none  pr-11 pt-4 pl-2 font-medium" />
                    {errors.ebookFile && <ErrorFormMessage message={errors.ebookFile.message} />}
                    <label
                        htmlFor="coverImageFile"
                        className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] "
                    >
                        Ebook File
                    </label>
                </div>

                <div>
                    <span className="absolute right-2 text-xl leading-[50px]">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                    </span>
                    <input type="file" id="version" required {...register("coverImageFile")} accept=".jpg,.jpeg,.png" 
                    className=" w-full h-full outline-none  pr-11 pt-4 pl-2 font-medium"/>
                    {errors.coverImageFile && <ErrorFormMessage message={errors.coverImageFile.message} />}
                    <label
                        htmlFor="coverImageFile"
                        className="absolute left-2 font-medium -translate-y-1/2  top-[-2px] "
                    >
                        Cover Image File
                    </label>
                </div>

                <button
                    type="submit"
                    className=" h-[45px] text-white text-xl font-medium bg-black rounded-lg hover:cursor-pointer"
                >
                    Update book
                </button>
            </form>
        </div>
    );
}
