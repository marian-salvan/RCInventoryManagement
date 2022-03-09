import React, { FC, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { EditQuantityModel } from '../../models/forms.models';
import { fireStoreDatabase, setQuantityModal, showQuantityModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import  './QuantityModal.css';

interface QuantityModalProps {
  modalTitle: string;
  buttonText: string;
}

const QuantityModal: FC<QuantityModalProps> = ({modalTitle, buttonText}) => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const showModal = useAppSelector(showQuantityModal);

  const [editQuantityModel, setditQuantityModel] = useState<EditQuantityModel>({
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
    const value = event.target.value as string;

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
                invalid={ editQuantityModel.validQuantity  !== null && !editQuantityModel.validQuantity }
              />
              <FormFeedback>
                Cantitatea introdusă trebuie să fie mai mare decât 0
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={updateQuantity} disabled={!(editQuantityModel.quantity && editQuantityModel.quantity)}>{buttonText}</Button>{' '}
          <Button color="secondary" onClick={toggle}>Anulează</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
};

export default QuantityModal;