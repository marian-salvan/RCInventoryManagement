import { Timestamp } from 'firebase/firestore';
import React, { FC, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appLabels, appMessages, appValidations } from '../../constants/messages.constants';
import { CampaignModel } from '../../models/campaigns.models';
import { NewCampaignStateModel } from '../../models/forms.models';
import { loggedInUserMetadata, setNewCampaign, setNewCampaignModal, showNewCampaignModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import './CreateCampaignModal.css';

interface CreateCampaignModalProps {}

const CreateCampaignModal: FC<CreateCampaignModalProps> = () =>  {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector(showNewCampaignModal);
  const userMetadata = useAppSelector(loggedInUserMetadata);

  const [newCampaginState, setdNewCampaignState] = useState<NewCampaignStateModel>({
    name: "",
    validName: null,
  });
  
  const toggle = () => {
    dispatch(setNewCampaignModal());
    setdNewCampaignState(
      {
        name: "",
        validName: null,
      }
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    newCampaginState.validName = value && value !== "" ? true : false;

    setdNewCampaignState({
      ...newCampaginState,
      [name]: value
    });
  }

  const createNewCampaign = () => {
    const { v4: uuidv4 } = require('uuid');

    const newCampaign: CampaignModel = {
      campaignId: uuidv4(),
      name: newCampaginState.name as string,
      orgId: userMetadata?.orgId as string,
      createdDate: Timestamp.fromDate(new Date()),
      active: false
    };

    dispatch(setNewCampaign(newCampaign));
    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newCampaginState.validName) {
      createNewCampaign();
    }
  }

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{appMessages.get("createNewCampaigTitle")}</ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">{appLabels.get("campaignName")}</Label>
              <Input
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                type="text"
                name="name"
                id="name"
                placeholder={appLabels.get("campaignName")}
                invalid={ newCampaginState.validName !== null && !newCampaginState.validName }
              />
              <FormFeedback>
                {appValidations.get("campaignName")}
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createNewCampaign} disabled={!(newCampaginState.validName)}>{appLabels.get("save")}</Button>{' '}
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
}


export default CreateCampaignModal;
