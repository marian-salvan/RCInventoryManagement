import { NavItem, NavLink, Nav, Button } from "reactstrap";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import './SideBar.css';
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { firebaseApp, setSideBarIsOpen, sideBarIsOpen } from "../../reducers/app.reducer";
import { getAuth, signOut } from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import { signOutUserAsync } from "../../thunks/auth.thunk";

const SideBar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  const isOpen = useAppSelector(sideBarIsOpen);
  const app = useAppSelector(firebaseApp);
  const auth = getAuth(app as FirebaseApp);

  const toggle = () => {
    dispatch(setSideBarIsOpen());
  }

  const logOut = () => {
    dispatch(signOutUserAsync(auth));
  }

  const checkActiveRoute = (route: string): boolean => {
    return route === location.pathname;
  }

  return (
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
          <NavItem className={checkActiveRoute("/products") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/products"}>
              Produse 
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/inventory") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/inventory"} >
              Inventar 
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/package-management") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/package-management"}>
              Pachete
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/reports") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/reports"}>
              Rapoarte
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={ () => logOut()}>Ieșiți din cont</NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
}

export default SideBar;