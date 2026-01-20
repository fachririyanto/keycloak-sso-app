// app config
export const AppName = import.meta.env.VITE_APP_NAME;
export const AppUrl = import.meta.env.VITE_APP_URL;
export const AppVersion = import.meta.env.VITE_APP_VERSION;

// api config
export const APIUrl = import.meta.env.VITE_API_URL;

// keycloak config
export const KeycloakConfig = {
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

// tanstack query config
export const TanstackQuery = {
    retry: false,
    staleTime: Infinity,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
};