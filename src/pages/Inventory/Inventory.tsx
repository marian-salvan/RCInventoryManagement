import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Table } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import CreateReportModal from '../../components/CreateReportModal/CreateReportModal';
import GridSearch from '../../components/GridSearch/GridSearch';
import QuantityModal from '../../components/QuantityModal/QuantityModal';
import { addQuantityModalMessage, addQuantityModalTitle, closeCurrentInventoryMessage, closeCurrentInventoryTitle, removeQuantityModalMessage, removeQuantityModalTitle } from '../../constants/messages.constants';
import { convertTimeStampToDateString, getCurrentDateString } from '../../helpers/date.helper';
import { ReportProductModel } from '../../models/reports.models';
import { actionAccepted, activeInventoryReport, allProducts, fireStoreDatabase, gridSearchText, newReportName, reloadReportsTable, setActionAccepted, setConfirmationModal, setConfirmationModalModel, setGridSearchText, setInventoryEntryToAdd, setInventoryEntryToSubstract, setNewReportModal, setQuantityModalModel, setReloadReportsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getAllProductsAsync } from '../../thunks/products.thunk';
import { closeCurrentReportAsync, createActiveReportAsync, getActiveInventoryReportsAsync } from '../../thunks/inventory-reports.thunk';
import  './Inventory.css';
import { defaulPackagesReportModel, defaultInventoryReportModel } from '../../constants/default.configs';

interface InventoryProps {}

const Inventory: FC<InventoryProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const reload = useAppSelector(reloadReportsTable);
  const currentInventoryReport = useAppSelector(activeInventoryReport);
  const availableProducts = useAppSelector(allProducts);
  const inventoryConfirmation = useAppSelector(actionAccepted);
  const reportName = useAppSelector(newReportName);
  const searchText = useAppSelector(gridSearchText);

  const [displayInventory, setDisplayInventory] = useState<ReportProductModel[]>([]);

  useEffect(() => {
    dispatch(getActiveInventoryReportsAsync(db));
    dispatch(getAllProductsAsync(db));

    return () => {
      dispatch(setGridSearchText(null));
    }
  }, []);

  useEffect(() => {
    if (reload) {
      dispatch(setReloadReportsTable());
      dispatch(getActiveInventoryReportsAsync(db));
    }
  }, [reload]);

  useEffect(() => { 
    if (currentInventoryReport) {
      (searchText !== null) ? setDisplayInventory(currentInventoryReport.inventory.filter(x => x.name.includes(searchText))) :
                              setDisplayInventory(currentInventoryReport.inventory);
    }
  }, [currentInventoryReport, searchText])
  
  useEffect(() => {
    if (inventoryConfirmation) {
      dispatch(setActionAccepted());
      dispatch(closeCurrentReportAsync(db));
    }
  }, [inventoryConfirmation]);
  
  useEffect(() => {
    if (availableProducts && availableProducts.length >= 0 && reportName) {
      let inventory: ReportProductModel[] = [];
      const { v4: uuidv4 } = require('uuid');
      const uid =  uuidv4();

      availableProducts.map(p => {
        let reportProductModel: ReportProductModel = {
          uid: p.uid,
          name: p.name,
          unit: p.unit,
          referencePrice: p.referencePrice,
          type: p.type,
          totalPrice: 0,
          quantity: 0
        }

        inventory.push(reportProductModel);
      });

      defaultInventoryReportModel.uid = uid;
      defaultInventoryReportModel.inventory = inventory;
      defaultInventoryReportModel.name = reportName;

      defaulPackagesReportModel.uid = uid;
      defaulPackagesReportModel.name = reportName;

      let inventoryReport = defaultInventoryReportModel;
      let packagesReport = defaulPackagesReportModel;

      dispatch(createActiveReportAsync({db, inventoryReport, packagesReport}));
      
    }
  }, [availableProducts, reportName])

  const openAddQtyModal = (reportProduct: ReportProductModel) => {
    dispatch(setQuantityModalModel({
      modalTitle: addQuantityModalTitle,
      buttonText: addQuantityModalMessage,
      buttonClass: "primary",
      addQty: true
    }))

    dispatch(setInventoryEntryToAdd(reportProduct));
  }

  const openRemoveQtyModal = (reportProduct: ReportProductModel) => {
    dispatch(setQuantityModalModel({
      modalTitle: removeQuantityModalTitle,
      buttonText: removeQuantityModalMessage,
      buttonClass: "danger",
      addQty: false
    }))

    dispatch(setInventoryEntryToSubstract(reportProduct));
  }

  const showCloseConfirmationModal = () => {
    dispatch(setConfirmationModalModel({
      title: closeCurrentInventoryTitle,
      message: closeCurrentInventoryMessage
    }));

    dispatch(setConfirmationModal());  
  }

  const showCreateNewReportModal = () => {
    dispatch(setNewReportModal());
  }

  if (currentInventoryReport?.inventory && currentInventoryReport.active && currentInventoryReport.inventory.length >= 0) {
    return ( 
      <div className="products-container">
         <Card>
          <CardBody>
            <CardTitle className="card-title">
              <h4>Inventar curent: {currentInventoryReport.name}</h4>
              <div className="button-container">
                <Button className="add-button" color="primary" onClick={() => showCloseConfirmationModal()}>Închide inventarul curent</Button>
              </div>
            </CardTitle>
            <CardSubtitle><h6>Perioada: {convertTimeStampToDateString(currentInventoryReport?.fromDate.seconds as number)} - {getCurrentDateString()}</h6></CardSubtitle>
            <GridSearch />
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
                  displayInventory.map((product, index) => (
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
        <QuantityModal/>
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