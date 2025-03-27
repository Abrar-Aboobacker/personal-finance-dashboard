import Test from "../pages/Test";
import AuthenticatedLayout from "../layout/AuthenticatedLayout/AuthenticatedLayout";
import DefaultLayout from "../layout/DefaultLayout/DefaultLayout";
import { appRoutes } from "../utils/routeNames";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

const Login = lazy(() => import("../pages/auth/Login"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<AuthenticatedLayout/>}>
      <Route index path={"test"} element={<Test />} />
      </Route>
      <Route element={<DefaultLayout />}>
      <Route path="/" element={<Navigate to={appRoutes.login} />} />
        <Route index path={appRoutes.login} element={<Login />} />
      </Route>
    </Route>
  )
);

const Routing = () => {
  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Routing;
