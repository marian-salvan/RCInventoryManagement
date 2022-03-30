import { FC, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { productTypesOptions, productTypesRoToEngMap, PRODUCT_TYPE_RO } from '../../constants/product-types.constants';
import { MEASSUREMENT_UNITS, unitOptions } from '../../constants/units.constants';
import { ProductAddStateModel } from '../../models/forms.models';
import { ProductModel } from '../../models/products.models';
import { setAddProductModal, setProductToBeAdded, showAddProductModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import './AddProductModal.css';

interface AddProductModalProps {}

const AddProductModal: FC<AddProductModalProps> = () => {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector(showAddProductModal);
  const [addProductModel, setAddProductMode] = useState<ProductAddStateModel>({
    uid: "",
    name: "",
    referencePrice: 0,
    validName: null,
    validReferencePrice: null,
    type: PRODUCT_TYPE_RO.FOOD,
    unit: MEASSUREMENT_UNITS.KG
  });
  
  const toggle = () => {
    dispatch(setAddProductModal());
    setAddProductMode(
      {
        uid: "",
        name: "",
        referencePrice: 0,
        validName: null,
        validReferencePrice: null,
        type: PRODUCT_TYPE_RO.FOOD,
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
    const { v4: uuidv4 } = require('uuid');

    const product: ProductModel = { 
      uid: uuidv4(),
      name: addProductModel.name.toLocaleLowerCase(), 
      referencePrice: addProductModel.referencePrice, 
      unit: addProductModel.unit,
      type: productTypesRoToEngMap.get(addProductModel.type) as string
    };

    dispatch(setProductToBeAdded(product));
    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && (addProductModel.validName && addProductModel.validReferencePrice)) {
      saveProduct();
    }
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
                onKeyDown={handleKeyDown}
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
                onKeyDown={handleKeyDown}
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
              <Label for="unit">Categorie</Label>
              <Input type="select" name="type" id="type" onChange={handleInputChange}>
                {
                  productTypesOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))
                }
              </Input>
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
