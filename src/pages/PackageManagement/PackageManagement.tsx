import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardSubtitle, CardTitle } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import EditPackagesModal from '../../components/EditPackagesModal/EditPackagesModal';
import { addQuantityModalMessage, addQuantityModalTitle, removeQuantityModalMessage, removeQuantityModalTitle } from '../../constants/messages.constants';
import { activeReport, fireStoreDatabase, reloadReportsTable, setPackagesModalModel, setReloadReportsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getActiveReportsAsync } from '../../thunks/reports.thunk';
import './PackageManagement.css';

interface PackageManagementProps {}

const PackageManagement: FC<PackageManagementProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const currentReport = useAppSelector(activeReport);
  const reload = useAppSelector(reloadReportsTable);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getActiveReportsAsync(db));
  }, []);

  useEffect(() => {
    if (reload) {
      dispatch(setReloadReportsTable());
      dispatch(getActiveReportsAsync(db));
    }

  }, [reload]);

  const gotToInvetoryPage = () => {
    navigate("/inventory", { replace: true });
  }

  const openRemovePackagesModal = () => {
    dispatch(setPackagesModalModel({
      modalTitle: removeQuantityModalTitle,
      buttonText: removeQuantityModalMessage,
      buttonClass: "danger",
      addQty: false
    }));
  }
  
  const openAddPackagesModal = () => {
    dispatch(setPackagesModalModel({
      modalTitle: addQuantityModalTitle,
      buttonText: addQuantityModalMessage,
      buttonClass: "primary",
      addQty: true
    }));
  }

  if (currentReport?.inventory && currentReport.active && currentReport.inventory.length > 0) {
    return (
      <div className="products-container">
      <Card>
      <CardBody>
        <CardTitle className="card-title">
          <h4>Adaugă pachete</h4>
          <div className="button-container">
            <Button className="add-button" color="danger" onClick={() => openRemovePackagesModal()}>Șterge pachete</Button>
            <Button className="add-button" color="primary" onClick={() => openAddPackagesModal()}>Adaugă pachete</Button>
          </div>
        </CardTitle>   
        <CardSubtitle className="card-title">
          <h6>Inventar curent: {currentReport.name}</h6>
        </CardSubtitle>  
        <Alert color="secondary" className="total-container">
          <h6 className="total-container-item">Totalul de pachete: {currentReport.packages.totalPackages}</h6>
          <h6 className="total-container-item">Cantitatea totală: {currentReport.packages.quantity} (KG)</h6>
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
      <CardTitle className="card-title">
        <h4>Pentru a adăuga pachete aveți nevoie de un invetar activ. Doriți să creați unul?</h4>
        <div className="button-container">
          <Button className="add-button" color="primary" onClick={() => gotToInvetoryPage()}>Creați inventar nou</Button>
        </div>
      </CardTitle>   
    </CardBody>
    </Card>
    <ConfirmationModal />
  </div>
  );  
} 

export default PackageManagement;