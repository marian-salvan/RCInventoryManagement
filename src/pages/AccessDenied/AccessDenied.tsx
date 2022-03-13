import { FC } from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import './AccessDenied.css';

interface AccessDeniedProps {}

const AccessDenied: FC<AccessDeniedProps> = () => (
  <div className="products-container">
    <Card>
    <CardBody>
      <CardTitle className="card-title">
        <h4>Nu ai acces la această pagină</h4>
      </CardTitle>   
    </CardBody>
    </Card>
  </div>
);

export default AccessDenied;
