"use client";

import { createContext } from "react";

import useAuth from "@/hooks/useAuth";

const Context = createContext();

interface IChildrenProps {
	children: React.ReactNode;
}

function UserProvider({ children }: IChildrenProps) {
	const { register, login, logout, authenticated, loading } = useAuth();

	return (
		<Context.Provider
			value={{ register, login, logout, authenticated, loading }}>
			{children}
		</Context.Provider>
	);
}

export { Context, UserProvider };
