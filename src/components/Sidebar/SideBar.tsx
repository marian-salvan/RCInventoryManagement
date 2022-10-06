import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import './SideBar.css';
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { firebaseApp, loggedInUserMetadata, setSideBarIsOpen, sideBarIsOpen } from "../../reducers/app.reducer";
import { getAuth } from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import { signOutUserAsync } from "../../thunks/auth.thunk";
import { appVersion } from "../../config/app.config";
import { appMessages } from "../../constants/messages.constants";

const SideBar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  
  const userMetadata = useAppSelector(loggedInUserMetadata);
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
    return location.pathname.includes(route);
  }

  return (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
        <span className="app-version">v{appVersion}</span>
        <span className="close-header" color="info" onClick={() => toggle} style={{ color: "#fff" }}>
          &times;
        </span>
        <div className="logo-container">
          <img className="logo-image" src="/round-logo.png" />
          <h4>{appMessages.get("appTitle")}</h4>
        </div>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <p>{appMessages.get("appGreeting")}, {userMetadata?.email}</p>
          <NavItem className={checkActiveRoute("/products") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/products"}>
            <i className="bi bi-bag-heart"></i> {appMessages.get("productsTitle")} 
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/categories") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/categories/categories-tab"}>
            <i className="bi bi-layout-text-sidebar"></i> {appMessages.get("categoriesTitle")} 
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/inventory") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/inventory"} >
            <i className="bi bi-clipboard2"></i> {appMessages.get("inventoryTitle")}  
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/package-management") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/package-management"}>
              <i className="bi bi-box2"></i> {appMessages.get("packagesTitle")}
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/reports") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/reports"}>
              <i className="bi bi-files"></i> {appMessages.get("reportsTitle")}
            </NavLink>
          </NavItem>
          <NavItem className={checkActiveRoute("/campaigns") ? "active-route" : ""}>
            <NavLink tag={Link} to={"/campaigns"}>
            <i className="bi bi-cart"></i> {appMessages.get("campaigns")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => logOut()}><i className="bi bi-power"></i> {appMessages.get("logOutTitle")}</NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
}

export default SideBar;