import classNames from "classnames";
import { Container } from "reactstrap";
import { Navigate, Route, Routes, } from "react-router-dom";
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
import InventoryManagerRoute from "../InventoryManagerRoute/InventoryManagerRoute";
import ReportDetails from "../../pages/ReportDetails/ReportDetails";

const Content = () => {
  const isOpen = useAppSelector(sideBarIsOpen);
  
  return (
    <Container
      fluid
      className={classNames("content", { "is-open": isOpen })}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>}/>
        <Route path="/inventory" element={<InventoryManagerRoute><Inventory /></InventoryManagerRoute>}/>
        <Route path="/package-management" element={ <InventoryManagerRoute><PackageManagement /></InventoryManagerRoute> } />
        <Route path="/reports" element={ <AdminRoute><Reports /></AdminRoute>} />
        <Route path="/reports/:reportId" element={<AdminRoute><ReportDetails /></AdminRoute>} />
        <Route path="/access-denied" element={<AccessDenied />}></Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default Content;