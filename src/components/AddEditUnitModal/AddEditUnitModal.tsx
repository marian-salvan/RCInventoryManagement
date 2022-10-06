import React, { FC, useEffect, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appLabels, appMessages, appValidations } from '../../constants/messages.constants';
import { NewCategoryStateModel } from '../../models/forms.models';
import { UnitModel } from '../../models/units.models';
import { addEditUnitModalModel, fireStoreDatabase, loggedInUserMetadata, setAddEditUnitModalModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { createUnitAsync, editUnitAsync } from '../../thunks/units.thunk';
import './AddEditUnitModal.css';

interface AddEditUnitModalProps {}

const AddEditUnitModal: FC<AddEditUnitModalProps> = () => {
  const dispatch = useAppDispatch();
  const modalModel = useAppSelector(addEditUnitModalModel);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const db = useAppSelector(fireStoreDatabase);

  const [newUnitState, setNewUnitState] = useState<NewCategoryStateModel>({
    name: "",
    validName: null,
  });

  useEffect(() => {
    if (modalModel?.unitModel && modalModel.showModal) {
      setNewUnitState({
        name: modalModel.unitModel.name,
        validName: true,
      });
    }
  }, [modalModel])
  
  const toggle = () => {
    dispatch(setAddEditUnitModalModel(null));
    setNewUnitState({
        name: "",
        validName: null,
    });
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    newUnitState.validName = value && value !== "" ? true : false;

    setNewUnitState({
      ...newUnitState,
      [name]: value
    });
  }

  const createNewUnit = () => {
    if (modalModel?.unitModel) {
      const unitModel: UnitModel = {
        uid: modalModel.unitModel.uid,
        name: newUnitState.name as string,
        orgId: modalModel.unitModel.orgId
      };

      dispatch(editUnitAsync({db, unitModel}));
    } else {
      const { v4: uuidv4 } = require('uuid');

      const unitModel: UnitModel = {
        uid: uuidv4(),
        name: newUnitState.name as string,
        orgId: userMetadata?.orgId as string,
      };
  
      dispatch(createUnitAsync({db, unitModel}));
    }
  
    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newUnitState.validName) {
      createNewUnit();
    }
  }

  return (
    <div>
      <Modal isOpen={modalModel?.showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{appMessages.get("createNewCategoryTitle")}</ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">{appLabels.get("unitName")}</Label>
              <Input
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                type="text"
                name="name"
                id="name"
                placeholder={appLabels.get("unitName")}
                value={newUnitState.name}
                invalid={ newUnitState.validName !== null && !newUnitState.validName }
              />
              <FormFeedback>
                {appValidations.get("unitName")}
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createNewUnit} disabled={!(newUnitState.validName)}>{appLabels.get("save")}</Button>{' '}
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default AddEditUnitModal;
