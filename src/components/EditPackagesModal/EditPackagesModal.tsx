import React, { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appLabels, appValidations } from '../../constants/messages.constants';
import { EditPackagesStateModel } from '../../models/forms.models';
import { ReportPackageModel } from '../../models/reports.models';
import { fireStoreDatabase, packagesModalModel, setPackagesModalModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { addPackagesAsync, removePackagesAsync } from '../../thunks/packages-reports.thunk';

interface EditPackagesModalProps {}

const EditPackagesModal: FC<EditPackagesModalProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const editPackageModel = useSelector(packagesModalModel);

  const [showModal, setShowModal] = useState(false);
  const [editPackagesStateModel, setEditPackagesStateModel] = useState<EditPackagesStateModel>({
    quantity: 0,
    totalPackages: 1,
    validQuantity: null,
    validTotalPackages: true
  });

  useEffect(() => {
    if (editPackageModel) {
      setShowModal(true);
    }
  }, [editPackageModel])
   
  const toggle = () => {
    setEditPackagesStateModel({
      quantity: 0,
      totalPackages: 1,
      validQuantity: null,
      validTotalPackages: true
    });

    setShowModal(false);
    dispatch(setPackagesModalModel(null));
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = parseFloat(event.target.value);

    setEditPackagesStateModel({
      ...editPackagesStateModel,
      [name]: value
    });
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value || parseFloat(event.target.value) < 0) {
      editPackagesStateModel.validQuantity = false;
    } else {
      editPackagesStateModel.validQuantity = true;
    }

    handleInputChange(event);
  }

  const handleTotalPackagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value || parseFloat(event.target.value) < 0) {
      editPackagesStateModel.validTotalPackages = false;
    } else {
      editPackagesStateModel.validTotalPackages = true;
    }

    handleInputChange(event);
  }

  const updateQuantity = () => {
    const packageReport: ReportPackageModel = {
      quantity: editPackagesStateModel.quantity,
      totalPackages: editPackagesStateModel.totalPackages
    };

    editPackageModel?.addQty ? dispatch(addPackagesAsync({db, packageReport}))
                             : dispatch(removePackagesAsync({db, packageReport}));

    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isButtonDisabled()) {
      updateQuantity();
    }
  }

  const isButtonDisabled = (): boolean => {
    return !(editPackagesStateModel.validQuantity && editPackagesStateModel.validTotalPackages);
  }

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{editPackageModel?.modalTitle}</ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
          <FormGroup>
              <Label for="totalPackages">{appLabels.get("packageNumber")}</Label>
              <Input
                onChange={handleTotalPackagesChange}
                onKeyDown={handleKeyDown}
                type="number"
                name="totalPackages"
                id="totalPackages"
                defaultValue={1}
                placeholder="Număr de pachete"
                invalid={ editPackagesStateModel.validTotalPackages !== null && !editPackagesStateModel.validTotalPackages }
              />
              <FormFeedback>
                {appValidations.get("positivePackageNumber")}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="quantity">{appLabels.get("packageQty")}</Label>
              <Input
                onChange={handleQuantityChange}
                onKeyDown={handleKeyDown}
                type="number"
                name="quantity"
                id="quantity"
                placeholder="Cantitate"
                invalid={ editPackagesStateModel.validQuantity !== null && !editPackagesStateModel.validQuantity }
              />
              <FormFeedback>
                {appValidations.get("positivePackageQty")}
              </FormFeedback>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color={editPackageModel?.buttonClass} 
                  onClick={updateQuantity} 
                  disabled={isButtonDisabled()}>
                  {editPackageModel?.buttonText}
          </Button>
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
}

export default EditPackagesModal;
