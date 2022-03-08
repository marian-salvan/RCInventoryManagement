import { FC, useEffect } from "react";
import classNames from "classnames";
import { Button, Container } from "reactstrap";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import './Content.css';
import Products from "../../pages/Products/Products";
import PackageManagement from "../../pages/PackageManagement/PackageManagement";
import Inventory from "../../pages/Inventory/Inventory";
import Reports from "../../pages/Reports/Reports";
import { useAppSelector } from "../../stores/hooks";
import { sideBarIsOpen } from "../../reducers/app.reducer";
import Login from "../../pages/Login/Login";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import AccessDenied from "../../pages/AccessDenied/AccessDenied";
import AdminRoute from "../AdminRoute/AdminRoute";

const Content = () => {
  const isOpen = useAppSelector(sideBarIsOpen);
  return (
    <Container
      fluid
      className={classNames("content", { "is-open": isOpen })}
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
          }/>
        <Route path="/inventory" element={ <Inventory /> } />
        <Route path="/package-management" element={<PackageManagement />} />
        <Route path="/reports" element={
            <AdminRoute>
                <Reports />
            </AdminRoute>
          }/>
        <Route path="/access-denied" element={<AccessDenied />}></Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default Content;