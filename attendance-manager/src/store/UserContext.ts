import { createContext } from "react";
import { User } from "../models/User";

export type UserContext = {
  user?: User;
  token?: string;
  setUser: (val: User) => void;
  setToken: (val: string) => void;
};

export const userContext = createContext<UserContext>({
  setUser: () => {},
  setToken: () => {},
});
export const { Provider, Consumer } = userContext;
