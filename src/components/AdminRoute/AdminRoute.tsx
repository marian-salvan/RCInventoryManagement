import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROLES } from '../../constants/roles.enum';
import { loggedInUserMetadata, loggedUser, setFromLocation,  } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import'./AdminRoute.css';

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute: FC<AdminRouteProps> = ({children}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(loggedUser);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const location = useLocation();

  dispatch(setFromLocation(location.pathname));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userMetadata?.role !== ROLES.ADMIN) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}

export default AdminRoute;
