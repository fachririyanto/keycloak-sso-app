import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { router } from "@/router";
import { KeycloakProvider, useKeycloak } from "@/components/authenticator";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <KeycloakProvider>
                <AppOutlet />
            </KeycloakProvider>
        </QueryClientProvider>
    );
}

function AppOutlet() {
    const { token } = useKeycloak();

    const auth = {
        token,
    };

    return <RouterProvider router={router} context={{ auth }} />;
}