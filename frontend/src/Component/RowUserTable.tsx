
import { RowUserDataType } from "../Page/UserManagement";


type Props = {
  data: RowUserDataType;
};

export default function RowUserTable({ data }: Props) {

  return (
    <tr>
      <th>{data["#"]}</th>
      <td>{data.id}</td>
      <td>{data.name}</td>
      <td>{data.username}</td>
      <td>{data.email}</td>
      <td>
        {
          <div className=" flex justify-start gap-3">
            <button
              className="p-3 bg-red-500 text-white cursor-pointer rounded hover:bg-red-600"
              onClick={() => data.functions.delete(data.id)}
            >
              Delete
            </button>

          </div>
        }
      </td>
    </tr>
  );
}
