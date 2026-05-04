"use client"

import { api } from "@/lib/api";
import { setUser } from "@/lib/redux/slice/userSlice";
import { clearAccessToken, setAccessToken } from "@/lib/token";
import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const dispatch = useDispatch();


    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await api.post("/auth/refresh");
                dispatch(setUser({ email: res.data.email, name: res.data.name, totalStorage: res.data.totalStorage, usedStorage: res.data.usedStorage }));
                setAccessToken(res.data.accessToken);
                setIsAuthenticated(true);
            } catch {
                clearAccessToken();
                setIsAuthenticated(false);
            }
            finally {
                setLoading(false);
            }
        }

        initAuth();
    }, [])

    const login = (token) => {
        setAccessToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        clearAccessToken();
        setIsAuthenticated(false);
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }
        }>
            {children}
        </AuthContext.Provider>
    );


}

export const useAuth = () => useContext(AuthContext)

