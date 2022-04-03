import { app } from 'firebase-admin';
import { FC, useEffect, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appLabels, appMessages, appValidations } from '../../constants/messages.constants';
import { productTypesEngToRoMap, productTypesOptions, productTypesRoToEngMap, PRODUCT_TYPE_RO } from '../../constants/product-types.constants';
import { MEASSUREMENT_UNITS, unitOptions } from '../../constants/units.constants';
import { ProductAddStateModel } from '../../models/forms.models';
import { ProductModel } from '../../models/products.models';
import { fireStoreDatabase, productToBeEdited, setAddEditProductModal, setProductToBeAdded, setProductToBeEdited, showAddEditProductModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { editProductAsync } from '../../thunks/products.thunk';
import './AddEditProductModal.css';

interface AddProductModalProps {}

const AddProductModal: FC<AddProductModalProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const saveEdit = useAppSelector(showAddEditProductModal);
  const prdToBeEdited = useAppSelector(productToBeEdited);
  const [addProductModel, setAddProductModel] = useState<ProductAddStateModel>({
    uid: "",
    name: "",
    referencePrice: 0,
    validName: null,
    validReferencePrice: null,
    type: PRODUCT_TYPE_RO.FOOD,
    unit: MEASSUREMENT_UNITS.KG
  });
  
  const toggle = () => {
    dispatch(setAddEditProductModal(null));
    dispatch(setProductToBeEdited(null));
    setAddProductModel(
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
  
  useEffect(() => {
    if (prdToBeEdited && !saveEdit) {
      debugger
      setAddProductModel(
        {
          uid: prdToBeEdited.uid,
          name: prdToBeEdited.name,
          referencePrice: prdToBeEdited.referencePrice,
          validName: true,
          validReferencePrice: true,
          type: productTypesEngToRoMap.get(prdToBeEdited.type) as string,
          unit: prdToBeEdited.unit
        }
      );
    }
  }, [prdToBeEdited])
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value as string;

    setAddProductModel({
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
    if (saveEdit) {
      const { v4: uuidv4 } = require('uuid');

      const product: ProductModel = { 
        uid: uuidv4(),
        name: addProductModel.name.toLocaleLowerCase(), 
        referencePrice: addProductModel.referencePrice as number, 
        unit: addProductModel.unit,
        type: productTypesRoToEngMap.get(addProductModel.type) as string
      };
  
      dispatch(setProductToBeAdded(product));
    } else {
      const product: ProductModel =  {
        uid: addProductModel.uid,
        name: addProductModel.name, 
        referencePrice: addProductModel.referencePrice, 
        unit: addProductModel.unit,
        type: productTypesRoToEngMap.get(addProductModel.type) as string,
      };

      dispatch(editProductAsync({db, product}));
    }

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

  const getHeaderTitle = (): string => {
    return saveEdit ? appMessages.get("addModalTitle") as string : 
                     `${appMessages.get("editModalTitle") as string} ${addProductModel.name}`;
  }

  return (
    <div>
      <Modal isOpen={saveEdit !== null} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{ getHeaderTitle() }</ModalHeader>
        <ModalBody>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="productName">{appLabels.get("name")}</Label>
              <Input
                onChange={handleNameChange}
                onKeyDown={handleKeyDown}
                type="text"
                name="name"
                id="productName"
                placeholder="Nume"
                value={addProductModel.name}
                invalid={ addProductModel.validName  !== null && !addProductModel.validName }
              />
              <FormFeedback>
              {appValidations.get("mandatoryName")}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="referencePrice">{appLabels.get("referencePrice")}</Label>
              <Input
                onChange={handleReferencePriceChange}
                onKeyDown={handleKeyDown}
                type="number"
                name="referencePrice"
                id="referencePrice"
                placeholder="Preț de referință"
                value={addProductModel.referencePrice as number}
                invalid={ addProductModel.validReferencePrice  !== null && !addProductModel.validReferencePrice }
              />
              <FormFeedback>
                {appValidations.get("positivePrice")}
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="unit">{appLabels.get("category")}</Label>
              <Input type="select" name="type" id="type" onChange={handleInputChange} value={addProductModel.type}>
                {
                  productTypesOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))
                }
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="unit">{appLabels.get("unit")}</Label>
              <Input type="select" name="unit" id="unit" onChange={handleInputChange}  value={addProductModel.unit}>
                {
                  unitOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))
                }
              </Input>
            </FormGroup>
            {
              !saveEdit && 
              <FormGroup>
                <span className="edit-warning">{appMessages.get("editWarning")}</span>
              </FormGroup>
            }    
          </Form>
         
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={saveProduct} 
                  disabled={!(addProductModel.validName && addProductModel.validReferencePrice)}>
                    { saveEdit ? appLabels.get("save") : appLabels.get("edit") }
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
  </div>
  );
}

export default AddProductModal;
