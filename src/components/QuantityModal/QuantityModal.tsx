import React, { FC, useEffect, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appLabels, appValidations } from '../../constants/messages.constants';
import { EditQuantityStateModel } from '../../models/forms.models';
import { ReportProductModel } from '../../models/reports.models';
import { activeCampaign, fireStoreDatabase, inventoryEntryToAdd, inventoryEntryToSubstract, loggedInUserMetadata, quantityModalModel, setQuantityModalModel } from '../../reducers/app.reducer';
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
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const activeOrgCampaign = useAppSelector(activeCampaign);

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
    const orgId = userMetadata?.orgId as string;
    const campaignId = activeOrgCampaign?.campaignId as string;

    if (quantityModal?.addQty) {
      const report = { ...reportToAdd } as ReportProductModel;
      report.quantity = editQuantityModel.quantity;
      
      dispatch(addQtyFromProductAsync({db, report, orgId, campaignId}))
    } else {
      const report = { ...reportToSubstract} as ReportProductModel;
      report.quantity = editQuantityModel.quantity;

      dispatch(removeQtyFromProductAsync({db, report, orgId, campaignId}))
    }

    toggle();
  }

  const getSelectedProductName = (): string => {
    return quantityModal?.addQty ? reportToAdd?.name as string : reportToSubstract?.name as string;
  }

  const getSelectedProductUnit = (): string => {
    return quantityModal?.addQty ? reportToAdd?.unit as string : reportToSubstract?.unit as string;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && editQuantityModel.validQuantity) {
      updateQuantity();
    }
  }

  return (
    <div>
      <Modal isOpen={showModal} autoFocus={false} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{quantityModal?.modalTitle} 
        {
          quantityModal?.addQty ? 
          <span className="add-product-title"> {getSelectedProductName()}</span> :
          <span className="substract-product-title"> {getSelectedProductName()}</span>
        }
        </ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="quantity">{appLabels.get("qty")} ({getSelectedProductUnit()})</Label>
              <Input
                autoFocus={true}
                onChange={handleQuantityChange}
                onKeyDown={handleKeyDown}
                type="number"
                name="quantity"
                id="quantity"
                placeholder={appLabels.get("qty")}
                invalid={ editQuantityModel.validQuantity !== null && !editQuantityModel.validQuantity }
              />
              <FormFeedback>
                {appValidations.get("positiveInventoryQty")}
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button type="submit"
                  color={quantityModal?.buttonClass}
                  onClick={updateQuantity} 
                  disabled={!(editQuantityModel.validQuantity)}>
                    {quantityModal?.buttonText}
           </Button>{' '}
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
};

export default QuantityModal;
