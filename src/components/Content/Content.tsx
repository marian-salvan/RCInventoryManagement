import { FC } from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Route, Routes } from "react-router-dom";
import './Content.css';
import Products from "../../pages/Products/Products";
import PackageManagement from "../../pages/PackageManagement/PackageManagement";
import Inventory from "../../pages/Inventory/Inventory";
import Reports from "../../pages/Reports/Reports";

export interface ContentProps {
    sidebarIsOpen: boolean;
}

const Content: FC<ContentProps> = ({ sidebarIsOpen }) => (
  <Container
    fluid
    className={classNames("content", { "is-open": sidebarIsOpen })}
  >
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/products" element={<Products />} />
      <Route path="/inventory" element={ <Inventory /> } />
      <Route path="/package-management" element={<PackageManagement />} />
      <Route path="/reports" element={<Reports /> } />
    </Routes>
  </Container>
);

export default Content;