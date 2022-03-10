import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Table } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import CreateReportModal from '../../components/CreateReportModal/CreateReportModal';
import QuantityModal from '../../components/QuantityModal/QuantityModal';
import { defaultReportModel } from '../../constants/default.configs';
import { addQuantityModalMessage, addQuantityModalTitle, closeCurrentInventoryMessage, closeCurrentInventoryTitle, removeQuantityModalMessage, removeQuantityModalTitle } from '../../constants/messages.constants';
import { convertTimeStampToDateString, getCurrentDateString } from '../../helpers/date.helper';
import { ReportProductModel } from '../../models/reports.models';
import { actionAccepted, activeReport, allProducts, fireStoreDatabase, newReportName, reloadReportsTable, setActionAccepted, setConfirmationModal, setConfirmationModalModel, setInventoryEntryToAdd, setInventoryEntryToSubstract, setNewReportModal, setQuantityModal, setReloadReportsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getAllProductsAsync } from '../../thunks/products.thunk';
import { closeCurrentReportAsync, createActiveReportAsync, getActiveReportsAsync } from '../../thunks/reports.thunk';
import  './Inventory.css';

interface InventoryProps {}

const Inventory: FC<InventoryProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const reload = useAppSelector(reloadReportsTable);
  const currentReport = useAppSelector(activeReport);
  const availableProducts = useAppSelector(allProducts);
  const inventoryConfirmation = useAppSelector(actionAccepted);
  const reportName = useAppSelector(newReportName);

  const [closeInventory, setCloseInventory] = useState(false);

  const [quantityModalConfing, setQuantityModalConfig] = useState({
    title: "",
    buttonText: "",
    addDelete: false
  });

  useEffect(() => {
    dispatch(getActiveReportsAsync(db));
    dispatch(getAllProductsAsync(db));
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

      dispatch(closeCurrentReportAsync(db));
      setCloseInventory(false);
    }
  }, [inventoryConfirmation]);
  
  useEffect(() => {
    debugger;
    if (availableProducts && availableProducts.length > 0 && reportName) {
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
      defaultReportModel.name = reportName;
      let report = defaultReportModel;
      dispatch(createActiveReportAsync({db, report}));
    }
  }, [availableProducts, reportName])

  const openAddQtyModal = (reportProduct: ReportProductModel) => {
    setQuantityModalConfig({
      title: addQuantityModalTitle,
      buttonText: addQuantityModalMessage,
      addDelete: true
    });
    dispatch(setQuantityModal());
    dispatch(setInventoryEntryToAdd(reportProduct));
  }

  const openRemoveQtyModal = (reportProduct: ReportProductModel) => {
    setQuantityModalConfig({
      title: removeQuantityModalTitle,
      buttonText:  removeQuantityModalMessage,
      addDelete: false
    });
    dispatch(setQuantityModal());
    dispatch(setInventoryEntryToSubstract(reportProduct));
  }

  const showCloseConfirmationModal = () => {
    dispatch(setConfirmationModalModel({
      title: closeCurrentInventoryTitle,
      message: closeCurrentInventoryMessage
    }));

    setCloseInventory(true);
    dispatch(setConfirmationModal());  
  }

  const showCreateNewReportModal = () => {
    dispatch(setNewReportModal());
  }

  if (currentReport?.inventory && currentReport.active && currentReport.inventory.length > 0) {
    return ( 
      <div className="products-container">
         <Card>
          <CardBody>
            <CardTitle className="card-title">
              <h4>Inventar curent: {currentReport.name}</h4>
              <div className="button-container">
                <Button className="add-button" color="primary" onClick={() => showCloseConfirmationModal()}>Închide inventarul curent</Button>
              </div>
            </CardTitle>
            <CardSubtitle><h6>Perioada: {convertTimeStampToDateString(currentReport?.fromDate.seconds as number)} - {getCurrentDateString()}</h6></CardSubtitle>
            <Table hover className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nume produs</th>
                  <th>Unitate de măsură</th>
                  <th>Preț de referință</th>
                  <th>Cantitate curentă</th>
                  <th>Preț total</th>
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
                    <td>{product.unit}</td>
                    <td>{product.referencePrice}</td>
                    <td>{product.quantity} ({product.unit})</td>
                    <td>{product.totalPrice}</td>
                    <td onClick={() => openRemoveQtyModal(product)}><i className="bi bi-dash-circle" title="Șterge cantitate"></i></td>
                    <td onClick={() => openAddQtyModal(product)}><i className="bi bi-plus-circle" title="Adaugă cantitate"></i></td>
                  </tr>
                  ))
                }
              </tbody>
            </Table> 
          </CardBody>
        </Card>
        <QuantityModal modalTitle={quantityModalConfing.title} buttonText={quantityModalConfing.buttonText} addQty={quantityModalConfing.addDelete}/>
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
            <Button className="add-button" color="primary" onClick={() => showCreateNewReportModal()}>Creați inventar nou</Button>
          </div>
        </CardTitle>   
      </CardBody>
      </Card>
      <ConfirmationModal />
      <CreateReportModal />
    </div>
  );
};

export default Inventory;