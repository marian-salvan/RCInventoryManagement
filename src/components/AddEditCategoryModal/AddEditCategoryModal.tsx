import React, { FC, useEffect, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appLabels, appMessages, appValidations } from '../../constants/messages.constants';
import { getCategoryName } from '../../helpers/categories.helper';
import { CategoryModel } from '../../models/categories.models';
import { NewCategoryStateModel } from '../../models/forms.models';
import { addEditCategoryModalModel, fireStoreDatabase, loggedInUserMetadata, setAddEditCategoryModalModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { createCategoryAsync, editCategoryAsync } from '../../thunks/categories.thunk';
import './AddEditCategoryModal.css';

interface AddEditCategoryModalProps {}

const AddEditCategoryModal: FC<AddEditCategoryModalProps> = () => {
  const dispatch = useAppDispatch();
  const modalModel = useAppSelector(addEditCategoryModalModel);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const db = useAppSelector(fireStoreDatabase);

  const [newCategoryState, setNewCategoryState] = useState<NewCategoryStateModel>({
    name: "",
    validName: null,
  });

  useEffect(() => {
    if (modalModel?.categoryModel && modalModel.showModal) {
      const name = getCategoryName(modalModel.categoryModel.name);
      setNewCategoryState({
        name: name,
        validName: true,
      });
    }
  }, [modalModel])
  
  const toggle = () => {
    dispatch(setAddEditCategoryModalModel(null));
    setNewCategoryState({
        name: "",
        validName: null,
    });
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    newCategoryState.validName = value && value !== "" ? true : false;

    setNewCategoryState({
      ...newCategoryState,
      [name]: value
    });
  }

  const createNewCategory = () => {

    if (modalModel?.categoryModel) {
      const categoryModel: CategoryModel = {
        uid: modalModel.categoryModel.uid,
        name: newCategoryState.name as string,
        orgId: modalModel.categoryModel.orgId
      };

      dispatch(editCategoryAsync({db, categoryModel}));
    } else {
      const { v4: uuidv4 } = require('uuid');

      const categoryModel: CategoryModel = {
        uid: uuidv4(),
        name: newCategoryState.name as string,
        orgId: userMetadata?.orgId as string,
      };
  
      dispatch(createCategoryAsync({db, categoryModel}));
    }
  
    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newCategoryState.validName) {
      createNewCategory();
    }
  }

  return (
    <div>
      <Modal isOpen={modalModel?.showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{appMessages.get("createNewCategoryTitle")}</ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">{appLabels.get("categoryName")}</Label>
              <Input
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                type="text"
                name="name"
                id="name"
                placeholder={appLabels.get("categoryName")}
                value={newCategoryState.name}
                invalid={ newCategoryState.validName !== null && !newCategoryState.validName }
              />
              <FormFeedback>
                {appValidations.get("categoryName")}
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createNewCategory} disabled={!(newCategoryState.validName)}>{appLabels.get("save")}</Button>{' '}
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AddEditCategoryModal;
