import React, { FC, useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { Button, Form, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appMessages, appLabels } from '../../constants/messages.constants';
import { ModifyInvProductsModalModel } from '../../models/modal.models';
import { ProductModel } from '../../models/products.models';
import { ReportProductModel } from '../../models/reports.models';
import { SelectOption } from '../../models/select.model';
import { activeCampaign, allProducts, fireStoreDatabase, loggedInUserMetadata, modifyInvProductsModalModel, setModifyInvProductsModalModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { updateInventoryAsync } from '../../thunks/inventory-reports.thunk';
import { getAllProductsAsync } from '../../thunks/products.thunk';
import './EditProductListModal.css';

interface ModifyProductListModalProps {}

const ModifyProductListModal: FC<ModifyProductListModalProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const modalModel = useAppSelector(modifyInvProductsModalModel);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const availableProducts = useAppSelector(allProducts);
  const activeOrgCampaign = useAppSelector(activeCampaign);

  const [multiselectOptions, setMultiselectOptions] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectOption[]>([]);
  const [defaultProducts, setDefaultProducts] = useState<SelectOption[]>([]);
  
  useEffect(() => {
    if (availableProducts) {
      const options = availableProducts.map(p => {
        const option: SelectOption = { value: p.uid, label: p.name };
        return option;
      });

      setMultiselectOptions(options);
    }
  }, [availableProducts])
  

  useEffect(() => {  
    if (modalModel.showModal) {
      const options = modalModel.inventoryProducts.map(p => {
        const option: SelectOption = { value: p.uid, label: p.name };
        return option;
      });

      setDefaultProducts(options);
    }
  }, [modalModel])
  
  const modifyInventoryProducts = () => {  
    let products: ReportProductModel[] = [];
    const orgId = userMetadata?.orgId as string;
    const campaignId = activeOrgCampaign?.campaignId as string;

    selectedProducts.forEach(selectedProduct => {      
      const existingInvetoryProduct = modalModel.inventoryProducts.find(ip => ip.uid === selectedProduct.value);

      if (existingInvetoryProduct !== undefined) {
        products.push(existingInvetoryProduct);
      } else {
        const newInventoryProduct = availableProducts?.find(p => p.uid === selectedProduct.value);

        products.push({ ...newInventoryProduct as ProductModel, totalPrice: 0.0, quantity: 0.0});
      }
    });

    dispatch(updateInventoryAsync({db, products, orgId, campaignId}));

    toggle();
  }

  const handleMultiselectChange = (value: MultiValue<SelectOption>) => {
    setSelectedProducts(value as SelectOption[]);
  }

  const toggle = () => {
    const modalModel: ModifyInvProductsModalModel = {
      showModal: false,
      inventoryProducts: []
    }

    dispatch(setModifyInvProductsModalModel(modalModel));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }

  return (
    <div>
    <Modal isOpen={modalModel.showModal} toggle={toggle} className="add-product-modal">
      <ModalHeader toggle={toggle}>{appMessages.get("modifyInventoryProductsTitle")}</ModalHeader>
      <ModalBody>
        <div className="warning-message">{appMessages.get("modifyInventoryProductsMessage")}</div>
        <Form className="form" onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">{appLabels.get("addProductsToInventory")}</Label>
            <Select
                defaultValue={defaultProducts}
                isMulti
                name="products"
                onChange={handleMultiselectChange}
                placeholder={appLabels.get("addProductsToInventory")}
                options={multiselectOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={modifyInventoryProducts}>{appLabels.get("save")}</Button>{' '}
        <Button color="secondary" onClick={toggle}>{appLabels.get("cancel")}</Button>
      </ModalFooter>
    </Modal>
  </div>
  );
}

export default ModifyProductListModal;
