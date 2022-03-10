import React, { FC, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { EditQuantityStateModel } from '../../models/forms.models';
import { ReportProductModel } from '../../models/reports.models';
import { fireStoreDatabase, inventoryEntryToAdd, inventoryEntryToSubstract, setQuantityModal, showQuantityModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { addQtyFromProductAsync, removeQtyFromProductAsync } from '../../thunks/reports.thunk';
import  './QuantityModal.css';

interface QuantityModalProps {
  modalTitle: string;
  buttonText: string;
  addQty: boolean;
}

const QuantityModal: FC<QuantityModalProps> = ({modalTitle, buttonText, addQty}) => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const showModal = useAppSelector(showQuantityModal);

  const reportToAdd = useAppSelector(inventoryEntryToAdd);
  const reportToSubstract = useAppSelector(inventoryEntryToSubstract);


  const [editQuantityModel, setditQuantityModel] = useState<EditQuantityStateModel>({
    quantity: 0,
    validQuantity: null,
  });
  
  const toggle = () => {
    dispatch(setQuantityModal());
    setditQuantityModel(
      {
        quantity: 0,
        validQuantity: null,
      }
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = parseFloat(event.target.value);

    setditQuantityModel({
      ...editQuantityModel,
      [name]: value
    });
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value || parseFloat(event.target.value) <= 0) {
      editQuantityModel.validQuantity = false;
    } else {
      editQuantityModel.validQuantity = true;
    }

    handleInputChange(event);
  }

  const updateQuantity = () => {
    if (addQty) {
      const report = { ...reportToAdd } as ReportProductModel;
      report.quantity = editQuantityModel.quantity;
      
      dispatch(addQtyFromProductAsync({db, report}))
    } else {
      const report = { ...reportToSubstract} as ReportProductModel;
      report.quantity = editQuantityModel.quantity;

      dispatch(removeQtyFromProductAsync({db, report}))
    }

    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="quantity">Cantitate</Label>
              <Input
                onChange={handleQuantityChange}
                type="number"
                name="quantity"
                id="quantity"
                placeholder="Cantitate"
                invalid={ editQuantityModel.validQuantity !== null && !editQuantityModel.validQuantity }
              />
              <FormFeedback>
                Cantitatea introdusă trebuie să fie mai mare decât 0
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={updateQuantity} disabled={!(editQuantityModel.validQuantity)}>{buttonText}</Button>{' '}
          <Button color="secondary" onClick={toggle}>Anulează</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
};

export default QuantityModal;
