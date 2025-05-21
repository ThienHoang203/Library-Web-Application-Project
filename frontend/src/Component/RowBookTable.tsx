import { useState } from "react";
import { RowBookDataType } from "../Page/BookManagement";
import UpdateBook from "./UpdateBook";

type Props = {
    data: RowBookDataType;
};

export default function RowBookTable({ data }: Props) {
    const [showUpdate, setShowUpdate] = useState(false);
    return (
        <tr>
            <th>{data["#"]}</th>
            <td>{data.id}</td>
            <td>{data.title}</td>
            <td>{data.format}</td>
            <td>{data.author}</td>
            <td>{data.genre}</td>
            <td>{String(data.publishedDate)}</td>
            <td>{data.version}</td>
            <td>
                {
                    <div className=" flex justify-start gap-3">
                        <button
                            className="p-3 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600"
                            onClick={() => data.functions.delete(data.id)}
                        >
                            Delete
                        </button>

                        <button
                            className="p-3 bg-blue-500 text-white cursor-pointer rounded hover:bg-blue-600"
                            onClick={() => setShowUpdate(true)}
                        >
                            Update
                        </button>

                        {showUpdate && (
                            <UpdateBook
                                bookId={data.id}
                                setClose={() => {
                                    setShowUpdate(false);
                                }}
                            />
                        )}
                    </div>
                }
            </td>
        </tr>
    );
}
