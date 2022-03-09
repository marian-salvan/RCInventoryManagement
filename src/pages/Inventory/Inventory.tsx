import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Table } from 'reactstrap';
import AddProductModal from '../../components/AddProductModal/AddProductModal';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { closeCurrentInventoryMessage, closeCurrentInventoryTitle, createCurrentInventoryMessage, createCurrentInventoryTitle } from '../../constants/messages.constants';
import { convertTimeStampToDateString, getCurrentDateString } from '../../helpers/date.helper';
import { ProductModel } from '../../models/products.models';
import { actionAccepted, activeReport, fireStoreDatabase, reloadProductsTable, setAddProductModal, setConfirmationModal, setConfirmationModalModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getActiveReportsAsync } from '../../thunks/reports.thunk';
import  './Inventory.css';

interface InventoryProps {}

const Inventory: FC<InventoryProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const reload = useAppSelector(reloadProductsTable);
  const report = useAppSelector(activeReport);
  const closeInventoryConfirmation = useAppSelector(actionAccepted);

  useEffect(() => {
    dispatch(getActiveReportsAsync(db));
  }, []);

  useEffect(() => {
    if (closeInventoryConfirmation) {
      console.log("da");
    }
  }, [closeInventoryConfirmation])

  const openAddQtyModal = (product: ProductModel) => {

  }

  const openRemoveQtyModal = (product: ProductModel) => {

  }

  const showCloseConfirmationModal = () => {
    dispatch(setConfirmationModalModel({
      title: closeCurrentInventoryTitle,
      message: closeCurrentInventoryMessage
    }));

    dispatch(setConfirmationModal());  
  }

  const showCreateConfirmationModal = () => {
    dispatch(setConfirmationModalModel({
      title: createCurrentInventoryTitle,
      message: createCurrentInventoryMessage
    }));
    
    dispatch(setConfirmationModal());  
  }

  if (report?.inventory && report.active && report.inventory.length > 0) {
    return ( 
      <div className="products-container">
         <Card>
          <CardBody>
            <CardTitle className="card-title">
              <h4>Inventar (perioada: {convertTimeStampToDateString(report?.fromDate.seconds as number)} - {getCurrentDateString()})</h4>
              <div className="button-container">
                <Button className="add-button" color="primary" onClick={() => showCloseConfirmationModal()}>Închide inventarul curent</Button>
              </div>
            </CardTitle>   
            <Table hover className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nume produs</th>
                  <th>Preț de referință</th>
                  <th>Unitate de măsură</th>
                  <th>Cantitate</th>
                  <th>Șterge cantitate</th>
                  <th>Adaugă cantitate</th>
                </tr>
              </thead>
              <tbody>
                {
                  report?.inventory.map((product, index) => (
                  <tr key={product.name}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.name}</td>
                    <td>{product.referencePrice}</td>
                    <td>{product.unit}</td>
                    <td>{product.quantity} ({product.unit})</td>
                    <td onClick={() => openAddQtyModal(product)}><i className="bi bi-dash-circle" title="Șterge cantitate"></i></td>
                    <td onClick={() => openRemoveQtyModal(product)}><i className="bi bi-plus-circle" title="Adaugă cantitate"></i></td>
                  </tr>
                  ))
                }
              </tbody>
            </Table> 
          </CardBody>
        </Card>
        <AddProductModal />
        <ConfirmationModal />
      </div>
    );
  }

  return (      
    <div className="products-container">
      <Card>
      <CardBody>
        <CardTitle className="card-title">
          <h4>Nu există un inventar activ. Doriți să creați unul?</h4>
          <div className="button-container">
            <Button className="add-button" color="primary" onClick={() => showCreateConfirmationModal()}>Creați inventar nou</Button>
          </div>
        </CardTitle>   
      </CardBody>
      </Card>
      <ConfirmationModal />
    </div>
  );
};

export default Inventory;
