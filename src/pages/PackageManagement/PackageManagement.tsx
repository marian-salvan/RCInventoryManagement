import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import './PackageManagement.css';

interface PackageManagementProps {}

const PackageManagement: FC<PackageManagementProps> = () => {
  const navigate = useNavigate();

  const gotToInvetoryPage = () => {
    navigate("/inventory", { replace: true });
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
