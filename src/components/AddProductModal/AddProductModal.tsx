import { FC, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { MEASSUREMENT_UNITS } from '../../constants/units.enums';
import { ProductAddModel } from '../../models/forms.models';
import { ProductModel } from '../../models/products.models';
import { setAddProductModal, showAddProductModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import './AddProductModal.css';

interface AddProductModalProps {}

const AddProductModal: FC<AddProductModalProps> = () => {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector(showAddProductModal);
  const [addProductModel, setAddProductMode] = useState<ProductAddModel>({
    name: "",
    referencePrice: 0,
    validName: null,
    validReferencePrice: null,
    unit: MEASSUREMENT_UNITS.KG
  });
  
  const unitOptions: string[] = [MEASSUREMENT_UNITS.KG, MEASSUREMENT_UNITS.L, MEASSUREMENT_UNITS.BUC];

  const toggle = () => {
    dispatch(setAddProductModal());
    setAddProductMode(
      {
        name: "",
        referencePrice: 0,
        validName: null,
        validReferencePrice: null,
        unit: MEASSUREMENT_UNITS.KG
      }
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value as string;

    setAddProductMode({
      ...addProductModel,
      [name]: value
    });
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value || event.target.value === "") {
      addProductModel.validName = false;
    } else {
      addProductModel.validName = true;
    }

    handleInputChange(event);
  }

  const handleReferencePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value || parseFloat(event.target.value) <= 0) {
      addProductModel.validReferencePrice = false;
    } else {
      addProductModel.validReferencePrice = true;
    }

    handleInputChange(event);
  }

  const saveProduct = () => {
    console.log(addProductModel);
    const saveProduct: ProductModel = { 
      name: addProductModel.name, 
      referencePrice: addProductModel.referencePrice, 
      unit: addProductModel.unit
    };

    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(addProductModel);
  }

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>Adaugă un produs nou</ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="productName">Nume</Label>
              <Input
                onChange={handleNameChange}
                type="text"
                name="name"
                id="productName"
                placeholder="Nume"
                invalid={ addProductModel.validName  !== null && !addProductModel.validName }
              />
              <FormFeedback>
                Numele este obligatoriu
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="referencePrice">Preț de referință</Label>
              <Input
                onChange={handleReferencePriceChange}
                type="number"
                name="referencePrice"
                id="referencePrice"
                placeholder="Preț de referință"
                invalid={ addProductModel.validReferencePrice  !== null && !addProductModel.validReferencePrice }
              />
              <FormFeedback>
                Prețul trebuie să fie mai mare decât 0
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="unit">Unitate de măsură</Label>
              <Input type="select" name="unit" id="unit" onChange={handleInputChange}>
                {
                  unitOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))
                }
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveProduct} disabled={!(addProductModel.validName && addProductModel.validReferencePrice)}>Salvează</Button>{' '}
          <Button color="secondary" onClick={toggle}>Anulează</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
}

export default AddProductModal;
