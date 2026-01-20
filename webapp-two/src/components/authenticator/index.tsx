import { createContext, useContext, useEffect, useState } from "react";
import Keycloak, { type KeycloakUserInfo } from "keycloak-js";

import { keyCloak } from "@/lib/keycloak/client";

interface KeycloakContextType {
    keycloak: Keycloak | null;
    user: KeycloakUserInfo | null;
    token: string;

    // methods
    updateUser: (userInfo: KeycloakUserInfo) => void;
}

const KeycloakContext = createContext<KeycloakContextType | null>(null);

export const useKeycloak = () => {
    const context = useContext(KeycloakContext);
    if (!context) {
        throw new Error("useKeycloak must be used within a KeycloakProvider");
    }
    return context;
};

export const KeycloakProvider = ({ children }: { children: React.ReactNode }) => {
    const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
    const [user, setUser] = useState<KeycloakUserInfo | null>(null);
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        if (keyCloak.didInitialize) {
            return;
        }

        keyCloak.init({
            onLoad: "login-required",
            silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
            pkceMethod: "S256",
        }).then((authenticated) => {
            if (authenticated) {
                keyCloak.loadUserInfo().then((userInfo) => {
                    setUser(userInfo);
                    setKeycloak(keyCloak);
                    setToken(keyCloak.token ?? "");
                });
            }
        }).catch((error) => {
            console.error("Failed to initialize Keycloak:", error);
        });
    }, [keyCloak]);

    const value: KeycloakContextType = {
        keycloak,
        user,
        token,
        updateUser: (userInfo: KeycloakUserInfo) => setUser(userInfo),
    };

    if (!keyCloak.didInitialize) {
        return null;
    }

    return (
        <KeycloakContext.Provider value={value}>
            {children}
        </KeycloakContext.Provider>
    );
};
