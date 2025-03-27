import { Navigate, useLocation } from 'react-router-dom';
import auth from '../../utils/auth';
import { appRoutes } from '../../utils/routeNames';


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
    <div>
        
    </div>
  )
}

export default AuthenticatedLayout