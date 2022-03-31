import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import EditPackagesModal from '../../components/EditPackagesModal/EditPackagesModal';
import { appLabels, appMessages } from '../../constants/messages.constants';
import { ROLES } from '../../constants/roles.enums';
import { activePackagesReport, fireStoreDatabase, loggedInUserMetadata,
  reloadReportsTable, setPackagesModalModel, setReloadReportsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getActivePackagesReportsAsync } from '../../thunks/packages-reports.thunk';
import './PackageManagement.css';

interface PackageManagementProps {}

const PackageManagement: FC<PackageManagementProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const currentReport = useAppSelector(activePackagesReport);
  const reload = useAppSelector(reloadReportsTable);
  const navigate = useNavigate();
  const userMetadata = useAppSelector(loggedInUserMetadata);

  useEffect(() => {
    dispatch(getActivePackagesReportsAsync(db));
  }, []);

  useEffect(() => {
    if (reload) {
      dispatch(setReloadReportsTable());
      dispatch(getActivePackagesReportsAsync(db));
    }

  }, [reload]);

  const gotToInvetoryPage = () => {
    navigate("/inventory", { replace: true });
  }

  const openRemovePackagesModal = () => {
    dispatch(setPackagesModalModel({
      modalTitle: appMessages.get("removeQuantityModalTitle") as string ,
      buttonText: appMessages.get("removeQuantityModalMessage") as string ,
      buttonClass: "danger",
      addQty: false
    }));
  }
  
  const openAddPackagesModal = () => {
    dispatch(setPackagesModalModel({
      modalTitle: appMessages.get("addQuantityModalTitle") as string,
      buttonText: appMessages.get("addQuantityModalMessage") as string,
      buttonClass: "primary",
      addQty: true
    }));
  }

  const userHasAccess = (): boolean => {
    return userMetadata?.role == ROLES.ADMIN;
  } 

  const getAverageQty = (): string => {
    if (currentReport && currentReport.packages.quantity > 0 && currentReport.packages.totalPackages > 0) {
      return (Math.round((currentReport.packages.quantity / currentReport.packages.totalPackages) * 100) / 100).toFixed(2);
    }

    return "0.00";
  }

  if (currentReport?.active) {
    return (
      <div className="products-container">
      <Card>
      <CardBody>
        <CardTitle className="card-title">
          <h4>{appLabels.get("addPackages")}</h4>
          <div className="button-container">
            <Button className="add-button" color="danger" onClick={() => openRemovePackagesModal()}>{appLabels.get("deletePackages")}</Button>
            <Button className="add-button" color="primary" onClick={() => openAddPackagesModal()}>{appLabels.get("addPackages")}</Button>
          </div>
        </CardTitle>   
        <CardSubtitle className="card-title">
          <h6>{appLabels.get("currentInventory")}: {currentReport.name}</h6>
        </CardSubtitle>  
        <Alert color="secondary" className="total-container" fade={false}>
          <h6 className="total-container-item">{appLabels.get("packagesTotal")}: {(Math.round(currentReport.packages.totalPackages * 100) / 100).toFixed(2)}</h6>
          <h6 className="total-container-item">{appLabels.get("packagesQty")}: {(Math.round(currentReport.packages.quantity * 100) / 100).toFixed(2)} (KG)</h6>
          <h6 className="total-container-item">{appLabels.get("packagesAvgQty")}: {getAverageQty()} (KG)</h6>
        </Alert>
      </CardBody>
      </Card>
       <EditPackagesModal />
    </div>
    );
  }

  return (
    <div className="products-container">
    <Card>
    <CardBody>
      {
        userHasAccess() ? 
          <CardTitle className="card-title">
            <h4>{appMessages.get("noActiveInventoryAdminPckgs")}</h4>
            <div className="button-container">
              <Button className="add-button" color="primary" onClick={() => gotToInvetoryPage()}>{appLabels.get("goToInventory")}</Button>
            </div>
          </CardTitle>   
        :
          <CardTitle className="card-title">
            <h4>{appMessages.get("noActiveInventoryPckgs")}</h4>
            <div className="button-container">
              <Button className="add-button" color="primary" onClick={() => gotToInvetoryPage()}>{appLabels.get("goToInventory")}</Button>
            </div>
        </CardTitle>   
      }    
    </CardBody>
    </Card>
    <ConfirmationModal />
  </div>
  );  
} 

export default PackageManagement;