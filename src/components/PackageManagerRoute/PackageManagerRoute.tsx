import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROLES } from '../../constants/roles.enum';
import { loggedInUserMetadata, loggedUser,  } from '../../reducers/app.reducer';
import { useAppSelector } from '../../stores/hooks';
import'./PackageManagerRoute.css';

interface PackageManagerRouteProps {
  children: JSX.Element;
}

const PackageManagerRoute: FC<PackageManagerRouteProps> = ({children}) => {
  const user = useAppSelector(loggedUser);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userMetadata?.role !== ROLES.ADMIN && userMetadata?.role !== ROLES.PACKAGE_MANAGER) {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  return children;
}

export default PackageManagerRoute;
