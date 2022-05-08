import React, { FC, useEffect } from 'react';
import { Button, Card, CardBody, CardTitle, Table } from 'reactstrap';
import CreateCampaignModal from '../../components/CreateCampaignModal/CreateCampaignModal';
import { appLabels } from '../../constants/messages.constants';
import { convertTimeStampToDateString } from '../../helpers/date.helper';
import { campaigns, fireStoreDatabase, loggedInUserMetadata, 
         newCampaign, setNewCampaign, setNewCampaignModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { createCampaignAsync } from '../../thunks/campaigns.thunk';
import './Campaigns.css';

interface CampaignsProps {}

const Campaigns: FC<CampaignsProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const newCampaignModel = useAppSelector(newCampaign);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const orgCampaigns = useAppSelector(campaigns);

  useEffect(() => {
    if (newCampaignModel) {
      const campaign = newCampaignModel;
      const orgId = userMetadata?.orgId as string;
      
      dispatch(createCampaignAsync({db, orgId, campaign}));
      dispatch(setNewCampaign(null));
    }

  }, [newCampaignModel])

  const createCampaign = () => {
    dispatch(setNewCampaignModal());
  }

  return (
    <div className="products-container">
       <Card>
        <CardBody>
        <CardTitle className="card-title">
            <h4>Campanii existente</h4>
            <div className="button-container">
            <Button className="add-button" color="primary" onClick={() => createCampaign()}>Createaza campanie</Button>
            </div>
          </CardTitle>  
          <div className="table-container">
            <Table hover className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nume</th>
                  <th>Data crearii</th>
                  <th>Stare</th>
                </tr>
              </thead>
              <tbody>
                {
                  orgCampaigns?.map((campaign, index) => (
                  <tr key={campaign.name}>
                    <td scope="row">{index + 1}</td>
                    <td>{campaign.name}</td>
                    <td>{convertTimeStampToDateString(campaign?.createdDate?.seconds as number)}</td>
                    <td>{campaign.active ? "activa" : "inactiva"}</td>
                  </tr>
                  ))
                } 
              </tbody>
            </Table> 
          </div>
        </CardBody>
      </Card>
      <CreateCampaignModal />
    </div>
  );
} 
export default Campaigns;
