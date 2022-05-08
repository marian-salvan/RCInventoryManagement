import { FC, useEffect } from 'react';
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarText, NavbarToggler, UncontrolledDropdown } from 'reactstrap';
import { appLabels } from '../../constants/messages.constants';
import { CampaignModel } from '../../models/campaigns.models';
import { activeCampaign, campaigns, fireStoreDatabase, loggedInUserMetadata, reloadCampaignTable, setReloadCampaignTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { changeActiveCampaignAsync, getAllCampaignsForOrgAsync } from '../../thunks/campaigns.thunk';
import './TopBar.css';

interface TopBarProps {}

const TopBar: FC<TopBarProps> = () => {
  const dispatch = useAppDispatch();  
  const db = useAppSelector(fireStoreDatabase);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const orgCampaigns = useAppSelector(campaigns);
  const activeOrgCampaign = useAppSelector(activeCampaign);
  const reload = useAppSelector(reloadCampaignTable);

  useEffect(() => {
    if (userMetadata) {
      const orgId = userMetadata.orgId;
      dispatch(getAllCampaignsForOrgAsync({db, orgId}));   
    }
  }, [userMetadata]);

  const changeCampaign = (campaign: CampaignModel) => {
    const orgId = userMetadata?.orgId as string;
    const newCampaignId = campaign.campaignId;
    const activeCampaignId = activeOrgCampaign?.campaignId as string;

    if (newCampaignId !== activeCampaignId) {
      dispatch(changeActiveCampaignAsync({db, orgId, newCampaignId, activeCampaignId }));
    }
  } 

  useEffect(() => {
    if (reload) {
      const orgId = userMetadata?.orgId as string;

      dispatch(setReloadCampaignTable());
      dispatch(getAllCampaignsForOrgAsync({db, orgId}));   
    }

  }, [reload]);

  return ( 
    <div>
      <Navbar
        color="light"
        expand="sm"
        light
      >
        {/* <NavbarToggler onClick={function noRefCheck(){}} /> */}
        <Collapse navbar  className="top-nav">
          <Nav
            className="ms-auto"
            navbar
          >
            <NavbarText>
              {appLabels.get("selectedCampaign")}: 
            </NavbarText>
            <UncontrolledDropdown direction='down'>
              <DropdownToggle caret nav>
                {activeOrgCampaign?.name}
              </DropdownToggle>
              <DropdownMenu> 
                {
                  orgCampaigns?.map((campaign) => (
                   <DropdownItem
                        className={activeOrgCampaign?.name === campaign.name ? 'active' : ''}
                        key={campaign.campaignId} 
                        onClick={() => changeCampaign(campaign)}>
                     {campaign.name}
                   </DropdownItem>
                  ))
                }              
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default TopBar;
