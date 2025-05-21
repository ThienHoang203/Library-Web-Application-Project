import { createContext } from "react";
import { User } from "../types/user.type";

type State = {
    user: undefined | User;
    accessToken: undefined | { token: string };
};

export const userInitialState: State = {
    user: undefined,
    accessToken: undefined
};

type Action =
    | {
          type: "login";
          token: string;
      }
    | {
          type: "authenticated";
          user: User;
      }
    | {
          type: "logout";
      };

export function userReducer(state: State, action: Action): State {
    switch (action.type) {
        case "login":
            return { ...state, accessToken: { token: action.token } };
        case "authenticated":
            return { ...state, user: action.user };
        case "logout":
            return { ...state, user: undefined, accessToken: undefined };
        default:
            return state;
    }
}

export type UserContextType = State & {
    dispatch: React.Dispatch<Action>;
};

export const UserContext = createContext<UserContextType>({
    ...userInitialState,
    dispatch: () => {}
});
