import { FC } from "react";
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";
import './SideBar.css';

export interface SideBarProps {
  isOpen: boolean;
  toggle: (state: boolean) => void;
}

const SideBar: FC<SideBarProps> = ({ isOpen, toggle }) => (
  <div className={classNames("sidebar", { "is-open": isOpen })}>
    <div className="sidebar-header">
      <span color="info" onClick={() => toggle} style={{ color: "#fff" }}>
        &times;
      </span>
      <h3>Crucea Roșie Română - Filiala Cluj</h3>
    </div>
    <div className="side-menu">
      <Nav vertical className="list-unstyled pb-3">
        <p>Management de donații</p>
        <NavItem>
          <NavLink tag={Link} to={"/products"}>
            Produse 
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={"/inventory"}>
            Inventar 
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={"/package-management"}>
            Pachete
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={"/reports"}>
            Rapoarte
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </div>
);

export default SideBar;