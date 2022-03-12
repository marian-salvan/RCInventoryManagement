import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROLES } from '../../constants/roles.enums';
import { loggedInUserMetadata, loggedUser, setFromLocation,  } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import'./PackageManagerRoute.css';

interface PackageManagerRouteProps {
  children: JSX.Element;
}

const PackageManagerRoute: FC<PackageManagerRouteProps> = ({children}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(loggedUser);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const location = useLocation();

  dispatch(setFromLocation(location.pathname));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userMetadata?.role !== ROLES.ADMIN && userMetadata?.role !== ROLES.PACKAGE_MANAGER) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default PackageManagerRoute;
