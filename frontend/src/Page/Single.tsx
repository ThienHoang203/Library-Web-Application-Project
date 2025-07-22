import { useContext, useEffect, useRef, useState } from "react";
import { Button, Slider, TextField } from "@mui/material";
import { Checkbox } from "@mui/material";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AddBookToStorage, borrowBook, CreateRating, DeleteRating, fetchGetABook } from "../Data/Api";
import { toast } from "react-toastify";
import { Book } from "../types/book.type";
import defaultCoverImage from "/vite.svg";
import { UserContext } from "../global-states/UserContext";

export default function Single() {
    const navigate = useNavigate();
    // const location = useLocation();
    const [rating, setRating] = useState(3);
    const [borrowedAt, setBorrowedAt] = useState(() => new Date().toISOString());
    const [onlyRating, setOnlyRating] = useState(false);
    const [review, setReview] = useState("");
    const params = useParams();
    const [book, setBook] = useState<Book | null>(null);
    const [averageRating, setAverageRating] = useState(0);
    const { accessToken, user } = useContext(UserContext);
    const sectionRef = useRef<HTMLDivElement>(null);
    const [reload, setReload] = useState(false);
    const [borrowForm, setBorrowForm] = useState(false);
    const handleScroll = () => {
        sectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    };

    function handleBorrow(id: number) {
        const data = {
            bookId: id,
            borrowedAt: new Date(borrowedAt)
        };
        console.log(data);

        borrowBook(accessToken?.token ?? "", data).then((result) => {
            console.log(result);
        });
        setBorrowForm(!borrowBook);
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0 });
    };

    function handleRating(id: number) {
        if (onlyRating) {
            setReview("");
        }
        const reviewData = {
            rating: rating,
            bookId: id,
            comment: review
        };
        CreateRating(accessToken?.token ?? "", reviewData).then((result) => {
            navigate(`/search/${params?.bookId}`, {});
            console.log(result);
        });
    }

    function handleAddStorage(id: number) {
        AddBookToStorage(accessToken?.token ?? "", id).then((result) => {
            console.log(result);
        });
    }

    function handleDelete(id: number) {
        DeleteRating(accessToken?.token ?? "", { ratingId: id }).then((result) => {
            navigate(`/search/${params?.bookId}`, {});
            console.log(result);
        });
    }

    const [coverImageLink, setCoverImageLink] = useState("");

    useEffect(() => {
        const bookId = params?.bookId;

        if (!bookId) return;
        toast.promise(
            fetchGetABook(bookId).then((d) => {
                setReload(!reload);
                setBook(d);
                setCoverImageLink(
                    d.coverImageFilename
                        ? `${import.meta.env.VITE_BOOK_COVER_IMAGE_URL}/${d.coverImageFilename}`
                        : defaultCoverImage
                );
            }),
            {
                error: {
                    render({ data }) {
                        const error = data as Error;
                        return error.message;
                    },
                    delay: 500
                }
            }
        );
        if (!book || book.ratings.length === 0) return;
        const totalRatingPoint = book.ratings.reduce((total, item) => total + item.rating, 0);

        setAverageRating(Math.ceil((totalRatingPoint * 100) / book.ratings.length) / 100);
    }, []);

    return !params.bookId ? (
        <Navigate to={"search"} replace />
    ) : !book ? (
        <div className="text-3xl p-10">Loading...</div>
    ) : (
        <div className="bg-gray-200 flex flex-wrap">
            <div
                onClick={scrollToTop}
                className="fixed bottom-5 right-5 cursor-pointer bg-white px-2 py-1 z-1000 rounded-[50px]"
            >
                {" "}
                up
            </div>
            <div className="w-[200px] h-[280px] m-4 story-img">
                <img
                    src={coverImageLink === "" ? defaultCoverImage : coverImageLink}
                    alt="Pool"
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="w-[770px] text-left p-5 ">
                <div className="mt-3 mb-7">
                    <h3 className="text-2xl font-medium mb-2">{book.title}</h3>
                    <p className="text-gray-600">{book.author}</p>
                </div>
                <div className="flex flex-nowrap gap-2">
                    <Link
                        target="_self"
                        to={`/view/${decodeURIComponent(book.ebookFilename ?? "")}`}
                        relative="path"
                        state={{ filename: book.ebookFilename ?? "", bookId: book.id }}
                        className="flex flex-nowrap items-center gap-2 bg-red-700 text-white font-medium  py-1 px-2 rounded hover:bg-[black] hover:text-[#ccb552] hover:cursor-pointer"
                    >
                        <i className="fa-solid fa-book-open"></i> <p>Đọc Sách</p>
                    </Link>

                    <button
                        onClick={() => handleAddStorage(book.id)}
                        className="ml-2 flex items-center gap-2 bg-yellow-700 text-white font-medium py-1 px-2 rounded  hover:bg-[black] hover:text-[#ccb552] hover:cursor-pointer"
                    >
                        <i className="far fa-bookmark"></i> <p>Đánh Dấu</p>
                    </button>

                    <button
                        onClick={handleScroll}
                        className="ml-2 flex items-center gap-2 bg-green-700 text-white font-medium py-1 px-2 rounded  hover:bg-[black] hover:text-[#ccb552] hover:cursor-pointer relative"
                    >
                        <i className="fas fa-star"></i> <p>Đánh Giá</p>
                        <span className="absolute bg-black rounded-full py-1 px-2 -right-5 -top-4 text-[12px] text-[#ccb552] ">
                            {averageRating}
                        </span>
                    </button>
                    <button
                        onClick={() => setBorrowForm(!borrowForm)}
                        className="ml-5 flex items-center gap-2 bg-cyan-700 text-white font-medium py-1 px-2 rounded  hover:bg-[black] hover:text-[#ccb552] hover:cursor-pointer relative"
                    >
                        <i className="fa-solid fa-truck-ramp-box"></i> <p>Mượn Sách</p>
                    </button>
                </div>
                {borrowForm && (
                    <div className="fixed p-5 top-1/2 left-3/6 w-[30%] transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white shadow-[0px_0px_20px_rgba(0,0,0,1)]">
                        <div className=" w-full">
                            <label>Choose Date and Time to get the book: </label>
                            <button
                                onClick={() => setBorrowForm(!borrowForm)}
                                className="text-gray-400 ml-35 font-semibold cursor-pointer hover:text-red-500 hover:scale-125 transition:scale duration-300 ease-in-out mt-2"
                            >
                                X
                            </button>
                        </div>
                        <input
                            className="cursor-pointer h-full w-full outline-none  border my-3 rounded-md p-2"
                            type="datetime-local"
                            value={borrowedAt.slice(0, 16)}
                            onChange={(e) => {
                                const isoDate = new Date(e.target.value).toISOString();
                                setBorrowedAt(isoDate);
                            }}
                        />
                        <button
                            onClick={() => handleBorrow(book.id)}
                            className=" flex items-center mx-auto h-full gap-4 bg-green-700 text-white text-[20px] font-medium py-1 px-5 rounded  hover:bg-[black] hover:text-[#ccb552] hover:cursor-pointer"
                        >
                            <i className="fa-solid fa-truck-ramp-box"></i> <p>Borrow</p>
                        </button>
                    </div>
                )}

                <div className="mt-3 flex gap-2">
                    {/* <span className="font-medium px-4 text-center">
            <p>0</p>
            <p>Lượt đọc</p>
          </span>
          <span className="font-medium px-4 border-l-2 text-center">
            <p>0</p>
            <p>Cất giữ</p>
          </span> */}
                    <span className="font-medium  px-4  text-center">
                        <p>{book.ratings.length}</p>
                        <p>Đánh giá</p>
                    </span>
                </div>
                <div className="flex gap-3">
                    <div className="mt-3 gap-2">
                        <button className="border-2 font-medium border-green-800 text-green-800 py-1 px-2 rounded">
                            {book.genre}
                        </button>
                    </div>
                    <div className="mt-3 gap-2">
                        <button className="border-2 font-medium border-green-800 text-green-800 py-1 px-2 rounded">
                            {book.format}
                        </button>
                    </div>
                </div>
            </div>
            <div className=" text-left w-full">
                <div className="bg-gradient-to-r from-[black] to-[#9a8686] p-2 text-white font-medium uppercase">
                    <h5>Giới Thiệu</h5>
                </div>
                <div className="intro-content p-2 text-black">
                    <p>{book.description}</p>
                </div>
            </div>
            <div className=" text-left w-full " ref={sectionRef}>
                <div className="bg-gradient-to-r from-[black] to-[#9a8686] p-2 text-white font-medium uppercase ">
                    <h5>Đánh Giá</h5>
                </div>
                <div className="bg-black text-white p-6 rounded-lg m-4">
                    <h2 className="text-lg font-bold mb-2">
                        Chấm điểm nội dung truyện:
                        <span className="text-yellow-500"> {rating} điểm</span>
                    </h2>
                    <Slider
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue as number)}
                        min={2}
                        max={5}
                        step={1}
                        sx={{ color: "#b38b00", height: 12 }}
                    />
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={onlyRating}
                            onChange={(e) => setOnlyRating(e.target.checked)}
                            sx={{ color: "#b38b00" }}
                        />
                        <span>Tôi chỉ muốn chấm điểm (không viết đánh giá)</span>
                    </div>
                    {!onlyRating && (
                        <div className="space-y-3 mt-4">
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                placeholder="Nội dung bài đánh giá (ít nhất 100 từ)"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                className="bg-white border border-gray-700 rounded"
                            />
                        </div>
                    )}
                    <Button
                        variant="outlined"
                        sx={{ borderColor: "#b38b00", color: "#b38b00", mt: 3 }}
                        fullWidth
                        onClick={() => handleRating(book.id)}
                    >
                        GỬI ĐÁNH GIÁ
                    </Button>
                </div>
                <div className="pl-6 mb-4">
                    <div className=" text-center">
                        <h3 data-x-text="`${book.review_count} đánh giá`" className="font-semibold">
                            {book.ratings.length} đánh giá
                        </h3>
                    </div>
                </div>

                {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                {book.ratings.map((item) => (
                    <div className="p-4 ml-4 mr-4 mb-5 text-base bg-white rounded-lg dark:bg-black">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                                    <img
                                        data-x-bind="ReviewerAvatar(index)"
                                        className="mr-2 w-6 h-6 rounded-full"
                                        src="https://static.cdnno.com/user/9bd6aaa8c55c28a8a0ff86276051d66d/200.jpg?1602384995"
                                        alt="Dương Ái Quốc"
                                    />
                                    <span data-x-bind="ReviewerName(index)" className="font-bold">
                                        {item.user.name}
                                    </span>
                                </p>
                                <div className="flex space-x-4 text-xs text-gray-300">
                                    <div className="flex items-center">
                                        <i className="fa-solid fa-star text-yellow-300"></i>
                                        <span data-x-text="review.average_score" className="ml-1 mt-1">
                                            {item.rating}
                                        </span>
                                    </div>
                                    {/* <div className="flex items-center">
                    <i className="fa-solid fa-eye"></i>
                    <span className="ml-1">30 chương</span>
                  </div> */}
                                </div>
                            </div>
                            {user?.id === item.user.id ? (
                                <div className="relative">
                                    <button
                                        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 hover:text-red-500 rounded "
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <p
                            data-x-bind="ReviewContent(index)"
                            className="text-gray-700 dark:text-gray-300 line-clamp break-words"
                            id="rvContent64393"
                        >
                            {item.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
