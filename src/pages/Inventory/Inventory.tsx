import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Table } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import QuantityModal from '../../components/QuantityModal/QuantityModal';
import { addQuantityModalMessage, addQuantityModalTitle, closeCurrentInventoryMessage, closeCurrentInventoryTitle, createCurrentInventoryMessage, createCurrentInventoryTitle, removeQuantityModalMessage, removeQuantityModalTitle } from '../../constants/messages.constants';
import { convertTimeStampToDateString, getCurrentDateString } from '../../helpers/date.helper';
import { defaultReportModel, ReportProductModel } from '../../models/reports.models';
import { actionAccepted, activeReport, allProducts, fireStoreDatabase, reloadProductsTable, reloadReportsTable, setActionAccepted, setAddProductModal, setConfirmationModal, setConfirmationModalModel, setQuantityModal, setReloadProductsTable, setReloadReportsTable, showQuantityModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getAllProductsAsync } from '../../thunks/products.thunk';
import { addQtyFromProductAsync, createActiveReportAsync, getActiveReportsAsync } from '../../thunks/reports.thunk';
import  './Inventory.css';

interface InventoryProps {}

const Inventory: FC<InventoryProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const reload = useAppSelector(reloadReportsTable);
  const currentReport = useAppSelector(activeReport);
  const availableProducts = useAppSelector(allProducts);
  const inventoryConfirmation = useAppSelector(actionAccepted);

  const [createInventory, setCreateInventory] = useState(false)
  const [closeInventory, setCloseInventory] = useState(false);

  const [quantityModalConfing, setQuantityModalConfig] = useState({
    title: "",
    buttonText: "",
    addDelete: false
  });


  useEffect(() => {
    dispatch(getActiveReportsAsync(db));
  }, []);

  useEffect(() => {
    if (reload) {
      dispatch(setReloadReportsTable());
      dispatch(getActiveReportsAsync(db));
    }

  }, [reload]);

  useEffect(() => {
    if (inventoryConfirmation) {
      dispatch(setActionAccepted());

      if (createInventory) {
        dispatch(getAllProductsAsync(db));
      }

      if (closeInventory) {
        setCloseInventory(false);
      }
    }
  }, [inventoryConfirmation])

  useEffect(() => {
    if (availableProducts && availableProducts.length > 0 && createInventory) {
      console.log(availableProducts);
      let inventory: ReportProductModel[] = [];

      availableProducts.map(p => {
        let reportProductModel: ReportProductModel = {
          name: p.name,
          unit: p.unit,
          referencePrice: p.referencePrice,
          totalPrice: 0,
          quantity: 0
        }

        inventory.push(reportProductModel);
      });

      defaultReportModel.inventory = inventory;
      let report = defaultReportModel;
      dispatch(createActiveReportAsync({db, report}));

      setCreateInventory(false);
    }
  }, [availableProducts])

  const openAddQtyModal = (report: ReportProductModel) => {
    setQuantityModalConfig({
      title: addQuantityModalTitle,
      buttonText: addQuantityModalMessage,
      addDelete: true
    });
    dispatch(setQuantityModal());

    dispatch(addQtyFromProductAsync({db, report}))

  }

  const openRemoveQtyModal = (product: ReportProductModel) => {
    setQuantityModalConfig({
      title: removeQuantityModalTitle,
      buttonText:  removeQuantityModalMessage,
      addDelete: false
    });
    dispatch(setQuantityModal());
  }

  const showCloseConfirmationModal = () => {
    dispatch(setConfirmationModalModel({
      title: closeCurrentInventoryTitle,
      message: closeCurrentInventoryMessage
    }));

    setCloseInventory(true);
    dispatch(setConfirmationModal());  
  }

  const showCreateConfirmationModal = () => {
    dispatch(setConfirmationModalModel({
      title: createCurrentInventoryTitle,
      message: createCurrentInventoryMessage
    }));
    
    setCreateInventory(true);
    dispatch(setConfirmationModal());  
  }

  if (currentReport?.inventory && currentReport.active && currentReport.inventory.length > 0) {
    return ( 
      <div className="products-container">
         <Card>
          <CardBody>
            <CardTitle className="card-title">
              <h4>Inventar (perioada: {convertTimeStampToDateString(currentReport?.fromDate.seconds as number)} - {getCurrentDateString()})</h4>
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
                  currentReport?.inventory.map((product, index) => (
                  <tr key={product.name}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.name}</td>
                    <td>{product.referencePrice}</td>
                    <td>{product.unit}</td>
                    <td>{product.quantity} ({product.unit})</td>
                    <td onClick={() => openRemoveQtyModal(product)}><i className="bi bi-dash-circle" title="Șterge cantitate"></i></td>
                    <td onClick={() => openAddQtyModal(product)}><i className="bi bi-plus-circle" title="Adaugă cantitate"></i></td>
                  </tr>
                  ))
                }
              </tbody>
            </Table> 
          </CardBody>
        </Card>
        <QuantityModal modalTitle={quantityModalConfing.title} buttonText={quantityModalConfing.buttonText}/>
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