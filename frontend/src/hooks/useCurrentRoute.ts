import { useLocation, useMatch } from "react-router-dom";

export function useCurrentRoute() {
    const location = useLocation();
    const isAdminRoute = useMatch("/admin");
    const isUserRoute = useMatch("/");
    const isLoginRoute = useMatch("/loginPage");

    return {
        state: location.state ?? {},
        path: location.pathname,
        isAdminRoute: !!isAdminRoute,
        isUserRoute: !!isUserRoute,
        isLoginRoute: !!isLoginRoute
    };
}
