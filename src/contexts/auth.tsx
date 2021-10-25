import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from "../interfaces/UserType";
import { api } from '../services/api';

type AuthContextData = {
    user: User | null;
    signInURL: string;
    signOut(): Promise<void>
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthResponse = {
    token: string;
    user: User;
}

type AuthProvider = {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProvider) {
    const [user, setUser] = useState<User | null>(null)

    const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=0a67a34dddc6f994c9ee`;

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('/api/authenticate', {
            code: githubCode
        })

        const { token, user } = response.data

        localStorage.setItem('@dowhile:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)
    }

    async function signOut() {
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(() => {
        async function loadedUser() {
            const token = localStorage.getItem('@dowhile:token')

            if (token) {
                api.defaults.headers.common.authorization = `Bearer ${token}`

                const response = await api.get<User>('/api/accounts/profile')
                setUser(response.data)
            }
        }

        loadedUser()
    }, [])

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode);

            signIn(githubCode);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ signInURL, user, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}