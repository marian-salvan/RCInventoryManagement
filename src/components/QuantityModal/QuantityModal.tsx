import React, { FC, useEffect, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { EditQuantityStateModel } from '../../models/forms.models';
import { ReportProductModel } from '../../models/reports.models';
import { fireStoreDatabase, inventoryEntryToAdd, inventoryEntryToSubstract, quantityModalModel, setQuantityModalModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { addQtyFromProductAsync, removeQtyFromProductAsync } from '../../thunks/inventory-reports.thunk';
import  './QuantityModal.css';

interface QuantityModalProps { }

const QuantityModal: FC<QuantityModalProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const quantityModal = useAppSelector(quantityModalModel);

  const reportToAdd = useAppSelector(inventoryEntryToAdd);
  const reportToSubstract = useAppSelector(inventoryEntryToSubstract);

  const [showModal, setShowModal] = useState(false);
  const [editQuantityModel, setEditQuantityModel] = useState<EditQuantityStateModel>({
    quantity: 0,
    validQuantity: null,
  });

  useEffect(() => {
    if (quantityModal) {
      setShowModal(true);
    }
  }, [quantityModal])
  
  
  const toggle = () => {
    setEditQuantityModel({
      quantity: 0,
      validQuantity: null,
    });

    setShowModal(false);
    dispatch(setQuantityModalModel(null));
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = parseFloat(event.target.value);

    setEditQuantityModel({
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
    if (quantityModal?.addQty) {
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
        <ModalHeader toggle={toggle}>{quantityModal?.modalTitle}</ModalHeader>
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
          <Button color={quantityModal?.buttonClass}
                  onClick={updateQuantity} 
                  disabled={!(editQuantityModel.validQuantity)}>
                    {quantityModal?.buttonText}
           </Button>{' '}
          <Button color="secondary" onClick={toggle}>Anulează</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
};

export default QuantityModal;
