import {createContext, useEffect, useState} from "react";
import axios from "axios";

const TOKEN_KEY= 'vendortoken'
const AuthContext = createContext(null);
const {Provider} = AuthContext;

const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        authenticated: null,
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            console.log('stored', token )
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
                setAuthState({
                    authenticated: true
                });
            }
        };

        loadToken()
    }, []);


    const logout = async () => {
        localStorage.clear()
        axios.defaults.headers.common['Authorization'] =  ``;
        setAuthState({
            authenticated: false,
        });
    };

    const getAccessToken = () => {
        return localStorage.getItem(TOKEN_KEY);
    };

    return (
        <Provider
            value={{
                authState,
                getAccessToken,
                setAuthState,
                logout,
            }}>
            {children}
        </Provider>
    );
};

export {AuthContext, AuthProvider, TOKEN_KEY};