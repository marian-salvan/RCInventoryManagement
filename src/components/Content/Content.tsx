import { FC, useEffect } from "react";
import classNames from "classnames";
import { Button, Container } from "reactstrap";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import './Content.css';
import Products from "../../pages/Products/Products";
import PackageManagement from "../../pages/PackageManagement/PackageManagement";
import Inventory from "../../pages/Inventory/Inventory";
import Reports from "../../pages/Reports/Reports";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { fireStoreDatabase, loggedUser, sideBarIsOpen } from "../../reducers/app.reducer";
import Login from "../../pages/Login/Login";
import { getLoggedInUserMetaDataAsync } from "../../thunks/users.thunk";

const Content = () => {
  const isOpen = useAppSelector(sideBarIsOpen);
  const user = useAppSelector(loggedUser)
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);

  useEffect(() => {
    console.log("logger");

    if (user != null) {
      navigate("/products");
      const email = user.user.email as string;
      dispatch(getLoggedInUserMetaDataAsync({db, email}));
      
      console.log(user);
    } else {
      navigate("/");
    }
  }, [user])


  return (
    <Container
      fluid
      className={classNames("content", { "is-open": isOpen })}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={ <Inventory /> } />
        <Route path="/package-management" element={<PackageManagement />} />
        <Route path="/reports" element={<Reports /> } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default Content;