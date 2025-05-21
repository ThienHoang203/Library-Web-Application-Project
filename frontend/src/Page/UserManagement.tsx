import { useContext, useEffect, useState } from "react";
import { User } from "../types/user.type";
import { fetchDeleteUser, fetchGetUsers } from "../Data/Api";
import { UserContext } from "../global-states/UserContext";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import RowUserTable from "../Component/RowUserTable";

export type RowUserDataType = User & {
  "#": number;
  functions: {
    delete: (id: number) => void;
    update: (id: number) => void;
  };
};


export default function UserManagement() {
  const { accessToken } = useContext(UserContext);
  const [colDef] = useState<string[]>([
    "#",
    "ID",
    "Name",
    "Username",
    "Email",
    "Functions",
  ]);
  const [rowData, setRowData] = useState<RowUserDataType[]>([]);

  useEffect(() => {
    fetchGetUsers("/user", accessToken?.token ?? "")
      .then((d) => {
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
                                fetchDeleteUser(id, accessToken?.token ?? ""),
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
                  update: (id: number) => {
                    toast.info(() => (
                      <div>
                        <p>Updated book with ID: {id}</p>
                      </div>
                    ));
                  },
                },
              };
            })
          );
      })
      .catch((e) => {
        if (e instanceof AxiosError) {
          if (
            e.response &&
            e.response.data &&
            typeof e.response.data.message === "string"
          ) {
            toast.error(String(e.response.data.message));
          }
          console.error(e);
        }
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
          <RowUserTable key={item.id} data={item} />
        ))}
      </tbody>
    </table>
  );
}
