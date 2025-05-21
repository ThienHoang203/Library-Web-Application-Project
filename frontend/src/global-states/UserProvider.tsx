import { useReducer } from "react";
import { UserContext, userInitialState, userReducer } from "./UserContext";

type Props = {
    children: React.ReactNode;
};

export default function UserProvider({ children }: Props) {
    const [{ user, accessToken }, dispatch] = useReducer(userReducer, userInitialState);
    return <UserContext.Provider value={{ user, accessToken, dispatch }}>{children}</UserContext.Provider>;
}
