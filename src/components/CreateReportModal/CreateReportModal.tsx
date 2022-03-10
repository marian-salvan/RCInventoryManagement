import React, { FC, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { createCurrentInventoryMessage, createCurrentInventoryTitle } from '../../constants/messages.constants';
import { NewReportStateModel } from '../../models/forms.models';
import { fireStoreDatabase, showNewReportModal, setNewReportModal, setNewReportName } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import './CreateReportModal.css';

interface CreateReportModalProps {}

const CreateReportModal: FC<CreateReportModalProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
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

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{createCurrentInventoryTitle}</ModalHeader>
        <ModalBody>
          <div>{createCurrentInventoryMessage}</div>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Nume inventar</Label>
              <Input
                onChange={handleInputChange}
                type="text"
                name="name"
                id="name"
                placeholder="Nume inventar"
                invalid={ newReportState.validName !== null && !newReportState.validName }
              />
              <FormFeedback>
                Numele este obligatoriu
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createNewReport} disabled={!(newReportState.validName)}>Salvează</Button>{' '}
          <Button color="secondary" onClick={toggle}>Anulează</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
};

export default CreateReportModal;
