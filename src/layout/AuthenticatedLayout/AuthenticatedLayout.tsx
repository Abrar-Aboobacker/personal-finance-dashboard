import { Navigate, useLocation } from "react-router-dom";
import auth from "../../utils/auth";
import { appRoutes } from "../../utils/routeNames";
import { Box } from "@mui/material";
import ResponsiveDrawer from "./components/Drawers/ResponsiveDrawer";

const AuthenticatedLayout = () => {
  const { pathname, search } = useLocation();

  if (auth.getToken() == null) {
    return (
      <Navigate
        to={{
          pathname: appRoutes.login,
          search:
            pathname !== "/"
              ? `?redirectTo=${encodeURIComponent(`${pathname}${search}`)}`
              : "",
        }}
      />
    );
  }
  return (
    <Box>
      <ResponsiveDrawer />
    </Box>
  );
};

export default AuthenticatedLayout;
