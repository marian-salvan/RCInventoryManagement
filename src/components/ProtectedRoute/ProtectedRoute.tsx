import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { loggedInUserMetadata, loggedUser,  } from '../../reducers/app.reducer';
import { useAppSelector } from '../../stores/hooks';
import'./ProtectedRoute.css';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({children}) => {
  const user = useAppSelector(loggedUser);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
