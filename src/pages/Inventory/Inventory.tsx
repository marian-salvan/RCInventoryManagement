import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Table } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import CreateReportModal from '../../components/CreateReportModal/CreateReportModal';
import GridSearch from '../../components/GridSearch/GridSearch';
import QuantityModal from '../../components/QuantityModal/QuantityModal';
import { convertTimeStampToDateString, getCurrentDateString } from '../../helpers/date.helper';
import { ReportProductModel } from '../../models/reports.models';
import { actionAccepted, activeInventoryReport, activePackagesReport, allProducts, fireStoreDatabase, 
  gridCategoryFilter, 
  gridSearchText, loggedInUserMetadata, newReportName, reloadReportsTable, setActionAccepted,
  setConfirmationModal, setConfirmationModalModel, setGridCategoryFilter, setGridSearchText, setInventoryEntryToAdd, 
  setInventoryEntryToSubstract, setNewReportModal, setNewReportName, setQuantityModalModel,
  setReloadReportsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getAllProductsAsync } from '../../thunks/products.thunk';
import { closeCurrentReportAsync, createActiveReportAsync, getActiveInventoryReportsAsync } from '../../thunks/inventory-reports.thunk';
import  './Inventory.css';
import { defaulPackagesReportModel, defaultInventoryReportModel } from '../../constants/default.configs';
import { ROLES } from '../../constants/roles.enums';
import { appMessages } from '../../constants/messages.constants';
import { productTypesEngToRoMap } from '../../constants/product-types.constants';
import { dowloadReport } from '../../helpers/reports.helper';
import GridCategoryFilter from '../../components/GridCategoryFilter/GridCategoryFilter';
import { GRID_SORT_ENUM } from '../../constants/grid.constants';
import { getProductModelSortingFunc } from '../../helpers/sorting.helper';

interface InventoryProps {}

const Inventory: FC<InventoryProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const reload = useAppSelector(reloadReportsTable);
  const currentInventoryReport = useAppSelector(activeInventoryReport);
  const packagesReport = useAppSelector(activePackagesReport);
  const availableProducts = useAppSelector(allProducts);
  const inventoryConfirmation = useAppSelector(actionAccepted);
  const reportName = useAppSelector(newReportName);
  const searchText = useAppSelector(gridSearchText);
  const categoryFilter = useAppSelector(gridCategoryFilter);
  const userMetadata = useAppSelector(loggedInUserMetadata);

  const [displayInventory, setDisplayInventory] = useState<ReportProductModel[]>([]);
  const [orderByColumn, setOrderByColumn] = useState<string>(GRID_SORT_ENUM.NAME);

  useEffect(() => {
    dispatch(getActiveInventoryReportsAsync(db));
    dispatch(getAllProductsAsync(db));

    return () => {
      dispatch(setGridSearchText(null));
      dispatch(setGridCategoryFilter(null));
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
      const sortedInventory = currentInventoryReport.inventory.map(product => {
        return {...product, type: productTypesEngToRoMap.get(product.type) as string};
      }).sort(getProductModelSortingFunc(orderByColumn));

      const searchedInventory = (searchText !== null) ? sortedInventory.filter(x => x.name.includes(searchText)):
                                                        sortedInventory;

      const filteredInventory = (categoryFilter !== null) ? searchedInventory.filter(x => x.type === categoryFilter) :
                                                            searchedInventory;

      setDisplayInventory(filteredInventory);
    }
  }, [currentInventoryReport, searchText, categoryFilter, orderByColumn])
  
  useEffect(() => {
    if (inventoryConfirmation) {
      dispatch(setActionAccepted());
      dispatch(closeCurrentReportAsync(db));
    }
  }, [inventoryConfirmation]);
  
  useEffect(() => {
    if (reportName) {
      let inventory: ReportProductModel[] = [];
      const { v4: uuidv4 } = require('uuid');
      const uid =  uuidv4();

      availableProducts?.map(p => {
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
      dispatch(setNewReportName(null));      
    }
  }, [reportName])

  const openAddQtyModal = (reportProduct: ReportProductModel) => {
    dispatch(setQuantityModalModel({
      modalTitle: appMessages.get("addQuantityModalTitle") as string,
      buttonText: appMessages.get("addQuantityModalMessage") as string,
      buttonClass: "primary",
      addQty: true
    }))

    dispatch(setInventoryEntryToAdd(reportProduct));
  }

  const openRemoveQtyModal = (reportProduct: ReportProductModel) => {
    dispatch(setQuantityModalModel({
      modalTitle: appMessages.get("removeQuantityModalTitle") as string,
      buttonText: appMessages.get("removeQuantityModalMessage") as string,
      buttonClass: "danger",
      addQty: false
    }))

    dispatch(setInventoryEntryToSubstract(reportProduct));
  }

  const showCloseConfirmationModal = () => {
    dispatch(setConfirmationModalModel({
      title: appMessages.get("closeCurrentInventoryTitle") as string,
      message: appMessages.get("closeCurrentInventoryMessage") as string,
      buttonColor: "danger"
    }));

    dispatch(setConfirmationModal());  
  }

  const downloadReport = () => {
    dowloadReport("inventory-table", currentInventoryReport, packagesReport);
  }

  const showCreateNewReportModal = () => {
    dispatch(setNewReportModal());
  }

  const sortAfterColumn = (sortColumn: GRID_SORT_ENUM) => {
    setOrderByColumn(sortColumn);
  }

  const userHasAccess = (): boolean => {
    return userMetadata?.role == ROLES.ADMIN;
  } 

  if (currentInventoryReport?.inventory && currentInventoryReport.active && currentInventoryReport.inventory.length >= 0) {
    return ( 
      <div className="products-container">
         <Card>
          <CardBody>
            <CardTitle className="card-title">
              <h4>Inventar curent: {currentInventoryReport.name}</h4>
              {
                userHasAccess() &&
                <div className="button-container">
                  <Button className="add-button" color="danger" onClick={() => showCloseConfirmationModal()}>Închide inventarul curent</Button>
                  <Button className="add-button" color="primary" onClick={() => downloadReport()}>Descarcă raport intermediar</Button>
                </div>
              }
            </CardTitle>
            <CardSubtitle><h6>Perioada: {convertTimeStampToDateString(currentInventoryReport?.fromDate.seconds as number)} - {getCurrentDateString()}</h6></CardSubtitle>
            <div className="inventory-table-header">
              <GridSearch />
              <GridCategoryFilter />
            </div>
            <div className="table-container">
              <Table hover className="inventory-table" id="inventory-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="grid-header-name" onClick={() => sortAfterColumn(GRID_SORT_ENUM.NAME)}>
                      {
                        orderByColumn === GRID_SORT_ENUM.NAME && <i className="bi bi-arrow-up"></i> 
                      }
                      <span>Nume produs </span>
                    </th>
                    <th className="grid-header-category" onClick={() => sortAfterColumn(GRID_SORT_ENUM.TYPE)}>
                      {
                        orderByColumn === GRID_SORT_ENUM.TYPE && <i className="bi bi-arrow-up"></i> 
                      }
                      <span>Categorie</span>
                    </th>
                    <th>Unitate de măsură</th>
                    { userHasAccess() && <th>Preț de referință</th> }
                    <th>Cantitate curentă</th>
                    { userHasAccess() && <th>Preț total</th> }
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
                      <td>{product.type}</td>
                      <td>{product.unit}</td>
                      { userHasAccess() && <td>{product.referencePrice }</td> }
                      <td>{(Math.round(product.quantity * 100) / 100).toFixed(2)} ({product.unit})</td>
                      { userHasAccess() && <td>{(Math.round(product.totalPrice * 100) / 100).toFixed(2)}</td> }
                      <td onClick={() => openRemoveQtyModal(product)}><i className="bi bi-dash-circle" title="Șterge cantitate"></i></td>
                      <td onClick={() => openAddQtyModal(product)}><i className="bi bi-plus-circle" title="Adaugă cantitate"></i></td>
                    </tr>
                    ))
                  }
                </tbody>
              </Table> 
            </div>
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
        { userHasAccess() ?  
          <CardTitle className="card-title">
            <h4>Nu există un inventar activ. Doriți să creați unul?</h4>
            <div className="button-container">
              <Button className="add-button" color="primary" onClick={() => showCreateNewReportModal()}>Creați inventar nou</Button>
            </div>
          </CardTitle>   
        : 
          <CardTitle className="card-title">
            <h4>Nu există un inventar activ. Contactați administratorul pentru crearea lui.</h4>
          </CardTitle>   
        }
      </CardBody>
      </Card>
      <ConfirmationModal />
      <CreateReportModal />
    </div>
  );
};

export default Inventory;