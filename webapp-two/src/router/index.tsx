import { createRouter } from "@tanstack/react-router";

import { rootRoute, appRoute } from "./__root";

// app routes
import { appMainRoute } from "./app/main";
import { appAccountRoute } from "./app/account";

// register routes
const routeTree = rootRoute.addChildren([
    appRoute.addChildren([
        appMainRoute,
        appAccountRoute,
    ]),
]);

export const router = createRouter({
    routeTree,
    context: {
        auth: {
            token: null,
        },
    },
});