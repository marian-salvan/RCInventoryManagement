import React, { FC, useEffect } from 'react';
import { Alert, Button, Card, CardBody, CardSubtitle, CardText, CardTitle, List, Table } from 'reactstrap';
import CreateCampaignModal from '../../components/CreateCampaignModal/CreateCampaignModal';
import { appLabels } from '../../constants/messages.constants';
import { convertTimeStampToDateString } from '../../helpers/date.helper';
import { campaigns, fireStoreDatabase, loggedInUserMetadata, newCampaign, reloadCampaignTable, setNewCampaign, setNewCampaignModal, setReloadCampaignTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { createCampaignAsync, getAllCampaignsForOrgAsync } from '../../thunks/campaigns.thunk';
import './Campaigns.css';

interface CampaignsProps {}

const Campaigns: FC<CampaignsProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const newCampaignModel = useAppSelector(newCampaign);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const orgCampaigns = useAppSelector(campaigns);
  const reload = useAppSelector(reloadCampaignTable);

  useEffect(() => {
    if (userMetadata) {
      const orgId = userMetadata.orgId;
      dispatch(getAllCampaignsForOrgAsync({db, orgId}));   
    }
  }, [])

  useEffect(() => {
    if (newCampaignModel) {
      const campaign = newCampaignModel;
      dispatch(createCampaignAsync({db, campaign}))
      dispatch(setNewCampaign(null));
    }

  }, [newCampaignModel])
  

  useEffect(() => {
    if (reload && userMetadata) {
      const orgId = userMetadata.orgId;

      dispatch(setReloadCampaignTable());
      dispatch(getAllCampaignsForOrgAsync({db, orgId}));
    }
  }, [reload]);


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
