import auth from "../../utils/auth";
import React from "react";
import {
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";

const DefaultLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (auth.getToken()) {
      if (location.pathname == "/") {
        let isDashboard = false;
        if (!isDashboard) {
          navigate(
            `/dashboard`
          );
        }
      }
    }
  }, [location.pathname]);
  return (
    <div>
      <ScrollRestoration
        getKey={(location, matches) => {
          // to avoid scroll restoration
          const paths = ["/"];
          return paths.includes(location.pathname)
            ? // home and notifications restore by pathname
              location.pathname
            : // everything else by location like the browser
              location.key;
        }}
      />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
