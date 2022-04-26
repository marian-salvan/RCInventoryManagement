import React, { FC, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { appLabels, appMessages, appValidations } from '../../constants/messages.constants';
import { NewReportStateModel } from '../../models/forms.models';
import { showNewReportModal, setNewReportModal, setNewReportName } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import './CreateReportModal.css';

interface CreateReportModalProps {}

const CreateReportModal: FC<CreateReportModalProps> = () => {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector(showNewReportModal);

  const [newReportState, setdNewReportState] = useState<NewReportStateModel>({
    name: "",
    validName: null,
  });
  
  const toggle = () => {
    dispatch(setNewReportModal());
    setdNewReportState(
      {
        name: "",
        validName: null,
      }
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    newReportState.validName = value && value !== "" ? true : false;

    setdNewReportState({
      ...newReportState,
      [name]: value
    });
  }

  const createNewReport = () => {
    dispatch(setNewReportName(newReportState.name as string));
    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newReportState.validName) {
      createNewReport();
    }
  }

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{appMessages.get("createCurrentInventoryTitle")}</ModalHeader>
        <ModalBody>
          <div>{appMessages.get("createCurrentInventoryMessage")}</div>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">{appLabels.get("inventoryName")}</Label>
              <Input
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                type="text"
                name="name"
                id="name"
                placeholder={appLabels.get("inventoryName")}
                invalid={ newReportState.validName !== null && !newReportState.validName }
              />
              <FormFeedback>
                {appValidations.get("mandatoryName")}
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createNewReport} disabled={!(newReportState.validName)}>{appLabels.get("save")}</Button>{' '}
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
};

export default CreateReportModal;
