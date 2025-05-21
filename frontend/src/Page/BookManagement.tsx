import { useContext, useEffect, useState } from "react";
import { Book } from "../types/book.type";
import { fetchDeleteBook, fetchGetBooks } from "../Data/Api";
import { toast } from "react-toastify";
import RowBookTable from "../Component/RowBookTable";
import { UserContext } from "../global-states/UserContext";

export type RowBookDataType = Book & {
  "#": number;
  functions: {
    delete: (id: number) => void;
  };
};

export default function BookManagement() {
  const [colDef] = useState<string[]>([
    "#",
    "ID",
    "Title",
    "Format",
    "Author",
    "Gerne",
    "Published Date",
    "Version",
    "Functions",
  ]);
  const [rowData, setRowData] = useState<RowBookDataType[]>([]);

  const { accessToken } = useContext(UserContext);

  useEffect(() => {
    fetchGetBooks("/book").then((d) => {
      if (d !== null)
        setRowData(
          d.map((d, index) => {
            return {
              ...d,
              "#": index + 1,
              functions: {
                delete: (id: number) => {
                  toast.warn(
                    () => (
                      <div>
                        <p>Are you sure?</p>
                        <button
                          onClick={() => {
                            toast.promise(
                              fetchDeleteBook(id, accessToken?.token ?? ""),
                              {
                                pending: "Deleting...",
                                success: `Book ID:${id} deleted`,
                                error: `Deleted unsuccessfully!`,
                              }
                            );
                          }}
                          className=" border border-solid p-1 px-5 rounded hover:border-transparent hover:text-white hover:bg-red-500 transition:color duration-300 ease"
                        >
                          Sure
                        </button>
                      </div>
                    ),
                    { closeOnClick: true }
                  );
                },
              },
            };
          })
        );
    });
  });

  return (
    <table className="w-full border-collapse">
      <thead className="bg-gray-800 text-white">
        <tr className="text-left [&>th]:p-4 [&>th]:border [&>th]:border-gray-700">
          {colDef.map((item) => (
            <th key={item}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody className="[&>tr]:even:bg-gray-300 [&>tr]:odd:bg-gray-100 [&>tr>*]:p-4  [&>tr>*]:border  [&>tr>*]:border-gray-300">
        {rowData.map((item) => (
          <RowBookTable data={item} key={item.id} />
        ))}
      </tbody>
    </table>
  );
}
