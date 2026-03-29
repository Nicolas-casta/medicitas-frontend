import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react';   
import { jwtDecode } from 'jwt-decode'
import type { User } from '../types'

interface AuthContextType {
    user: User | null
    accessToken: string | null
    loginUser: (accessToken: string, refreshToken: string) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [accessToken, setAccessToken] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            try {
                const decoded = jwtDecode<User>(token)
                setUser(decoded)
                setAccessToken(token)
            } catch {
                localStorage.clear()
            }
        }
    }, [])

    const loginUser = (access: string, refresh: string) => {
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
        const decoded = jwtDecode<User>(access)
        setUser(decoded)
        setAccessToken(access)
    }

    const logout = () => {
        localStorage.clear()
        setUser(null)
        setAccessToken(null)
    }

    return (
        <AuthContext.Provider value={{
            user, accessToken,
            loginUser, logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)