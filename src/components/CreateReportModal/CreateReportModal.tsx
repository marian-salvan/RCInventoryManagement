import React, { FC, useEffect, useState } from 'react';
import { Button, Form, FormFeedback, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { appLabels, appMessages, appValidations, productSelectionOptions } from '../../constants/messages.constants';
import { NewReportStateModel } from '../../models/forms.models';
import { showNewReportModal, setNewReportModal, allProducts, setNewReportModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import Select, { MultiValue } from 'react-select';
import './CreateReportModal.css';
import { SelectOption } from '../../models/select.model';
import { ProductModel } from '../../models/products.models';
import { NewReportModel } from '../../models/reports.models';

interface CreateReportModalProps {}

const CreateReportModal: FC<CreateReportModalProps> = () => {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector(showNewReportModal);
  const products = useAppSelector(allProducts);

  const [multiselectOptions, setMultiselectOptions] = useState<any[]>([]);
  const [productOptions, setProductOptions] = useState<SelectOption[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>([]);

  const [newReportState, setdNewReportState] = useState<NewReportStateModel>({
    name: "",
    productOption: productSelectionOptions.get("all") as string,
    validName: null,
  });
  
  useEffect(() => {
    if (products) {
      let selectionOptions: SelectOption[] = [];

      const options = products.map(p => {
        const option: SelectOption = { value: p.uid, label: p.name };
        return option;
      });

      for (const [key, value] of productSelectionOptions.entries()) {
        const option: SelectOption = { value: key, label: value };
        selectionOptions.push(option);
      }

      setMultiselectOptions(options);
      setProductOptions(selectionOptions);
    }
  }, [products]);
 
  const toggle = () => {
    dispatch(setNewReportModal());
    setSelectedProducts([]);
    setdNewReportState(
      {
        name: "",
        productOption: productSelectionOptions.get("all") as string,
        validName: null,
      }
    );
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    newReportState.validName = value && value !== "" ? true : false;

    setdNewReportState({
      ...newReportState,
      [name]: value
    });
  }

  const handleSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    setdNewReportState({
      ...newReportState,
      [name]: value
    });  }

  const handleMultiselectChange = (value: MultiValue<SelectOption>) => {
    setSelectedProducts(value as SelectOption[]);
  }

  const createNewReport = () => {
    let inventoryProducts: ProductModel[] = [];

    switch(newReportState.productOption) {
      case productSelectionOptions.get("all"): 
        inventoryProducts = products as ProductModel[]; 
        break;
      case productSelectionOptions.get("none"): 
        inventoryProducts = []; 
        break;
      case productSelectionOptions.get("selectProducts"): 
        inventoryProducts = products?.filter(p => selectedProducts.find(sp => sp.value === p.uid) !== undefined) as ProductModel[]; 
      break;
    }

    const newReportModel: NewReportModel = {
      reportName: newReportState.name as string,
      selectedProuducts: inventoryProducts
    }

    dispatch(setNewReportModel(newReportModel));
    toggle();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newReportState.validName) {
      createNewReport();
    }
  }

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{appMessages.get("createCurrentInventoryTitle")}</ModalHeader>
        <ModalBody>
          <div>{appMessages.get("createCurrentInventoryMessage")}</div>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">{appLabels.get("inventoryName")}</Label>
              <Input
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                type="text"
                name="name"
                id="name"
                placeholder={appLabels.get("inventoryName")}
                invalid={ newReportState.validName !== null && !newReportState.validName }
              />
              <FormFeedback>
                {appValidations.get("mandatoryName")}
              </FormFeedback>
            </FormGroup>
              <FormGroup>
              <Label for="productOption">{appLabels.get("productOption")}</Label>
              <Input type="select" name="productOption" id="productOption" 
                     onChange={handleSelectionChange} value={newReportState.productOption}>
                {
                  productOptions.map(opt => (
                    <option key={opt.value}>{opt.label}</option>
                  ))
                }
              </Input>
            </FormGroup> 
            {
              newReportState.productOption === productSelectionOptions.get("selectProducts") &&
              <FormGroup>
                <Label for="name">{appLabels.get("addProductsToInventory")}</Label>
                <Select
                    defaultValue={[]}
                    isMulti
                    name="products"
                    onChange={handleMultiselectChange}
                    placeholder={appLabels.get("addProductsToInventory")}
                    options={multiselectOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    />
              </FormGroup>
            }
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={createNewReport} disabled={!(newReportState.validName)}>{appLabels.get("save")}</Button>{' '}
          <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CreateReportModal;
