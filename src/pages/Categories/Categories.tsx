import React, { FC, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Nav, NavItem, NavLink } from 'reactstrap';
import AddEditCategoryModal from '../../components/AddEditCategoryModal/AddEditCategoryModal';
import AddEditUnitModal from '../../components/AddEditUnitModal/AddEditUnitModal';
import { appLabels, appMessages } from '../../constants/messages.constants';
import { setAddEditCategoryModalModel, setAddEditUnitModalModel } from '../../reducers/app.reducer';
import { useAppDispatch } from '../../stores/hooks';
import './Categories.css';

interface CategoriesProps {}

const Categories: FC<CategoriesProps> = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
   
  const checkActiveRoute = (route: string): boolean => {
    return location.pathname.includes(route);
  }
  
  const openAddCategoryModal = () => {
    dispatch(setAddEditCategoryModalModel({
      showModal: true,
      categoryModel: null
    }));
  }

  const openAddUnitModal = () => {
    dispatch(setAddEditUnitModalModel({
      showModal: true,
      unitModel: null
    }));
  }

  return (
    <div className="products-container">
      <Card>
        <CardBody>
          <CardTitle>
            <h4>{appMessages.get("categoriesTitle")}</h4>
            <div className="button-container">
            { checkActiveRoute("/categories-tab") && 
                <Button className="add-button" color="primary" onClick={() => openAddCategoryModal()}>{appLabels.get("addCategory")}</Button> }
            { checkActiveRoute("/units-tab") &&
                <Button className="add-button" color="primary" onClick={() => openAddUnitModal()}>{appLabels.get("addUnit")}</Button> }
            </div>
          </CardTitle>
          <Nav tabs>
            <NavItem>
              <NavLink className="categories-nav-link" 
                       tag={Link} 
                       to={"categories-tab"}
                       active={checkActiveRoute("/categories-tab")}> 
                        {appMessages.get("seeCategoriesTitle")} 
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="units-nav-link" 
                       tag={Link} 
                       to={"units-tab"} 
                       active={checkActiveRoute("/units-tab")}>
                        {appMessages.get("seeUnitsTitle")}
              </NavLink>
            </NavItem>
          </Nav>
          <Outlet />
        </CardBody>
      </Card>
      <AddEditCategoryModal />
      <AddEditUnitModal />
    </div>
  )
};

export default Categories;
