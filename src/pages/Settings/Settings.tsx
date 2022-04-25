import React, { FC } from 'react';
import { Alert, Button, Card, CardBody, CardSubtitle, CardText, CardTitle, List } from 'reactstrap';
import { appLabels } from '../../constants/messages.constants';
import './Settings.css';

interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {

  const createCampaign = () => {

  }

  return (
    <Card className="settings">
      <CardBody>
        <CardTitle className="card-title">
          <h4>Setari</h4>
        </CardTitle>   
        <Alert color="secondary" className="setting" fade={false}>
          <div className="campaign-title-container">
            <h5>Creaza campanie noua </h5>
            <Button className="add-button" color="primary" onClick={() => createCampaign()}>Creaza campanie</Button>         
          </div>
          <div>
            <h6>Campania curenta: Option 1</h6>
            <List type="unstyled">
              <li>
                <h6>Campanii disponibile: Option 1</h6>
              </li>
              <ul>
                <li>
                  Phasellus iaculis neque
                </li>
                <li>
                  Purus sodales ultricies
                </li>
                <li>
                  Vestibulum laoreet porttitor sem
                </li>
                <li>
                  Ac tristique libero volutpat at
                </li>
              </ul>
            </List>
          </div>
        </Alert>
      </CardBody>
    </Card>
  );
} 
export default Settings;
