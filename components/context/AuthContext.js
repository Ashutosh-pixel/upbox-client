"use client"

import { api } from "@/lib/api";
import { clearAccessToken, setAccessToken } from "@/lib/token";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await api.post("/auth/refresh");

                setAccessToken(res.data.accessToken);
                setIsAuthenticated(true);
            } catch (error) {
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

