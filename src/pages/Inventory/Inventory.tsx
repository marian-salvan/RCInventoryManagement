import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Table } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import CreateReportModal from '../../components/CreateReportModal/CreateReportModal';
import GridSearch from '../../components/GridSearch/GridSearch';
import QuantityModal from '../../components/QuantityModal/QuantityModal';
import { convertTimeStampToDateString, getCurrentDateString } from '../../helpers/date.helper';
import { ReportProductModel } from '../../models/reports.models';
import { actionAccepted, activeCampaign, activeInventoryReport, activePackagesReport, fireStoreDatabase, 
  gridCategoryFilter, 
  gridSearchText, loggedInUserMetadata, newReportModel, reloadReportsTable, setActionAccepted,
  setConfirmationModal, setConfirmationModalModel, setGridCategoryFilter, setGridSearchText, setInventoryEntryToAdd, 
  setInventoryEntryToSubstract, setModifyInvProductsModalModel, setNewReportModal, setNewReportModel, setQuantityModalModel, setReloadReportsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getAllProductsAsync } from '../../thunks/products.thunk';
import { closeCurrentReportAsync, createActiveReportAsync, getActiveInventoryReportsAsync } from '../../thunks/inventory-reports.thunk';
import  './Inventory.css';
import { defaulPackagesReportModel, defaultInventoryReportModel } from '../../constants/default.configs';
import { ROLES } from '../../constants/roles.enums';
import { appLabels, appMessages } from '../../constants/messages.constants';
import { dowloadReport } from '../../helpers/reports.helper';
import GridCategoryFilter from '../../components/GridCategoryFilter/GridCategoryFilter';
import { GRID_SORT_ENUM } from '../../constants/grid.constants';
import { getProductModelSortingFunc } from '../../helpers/sorting.helper';
import EditProductListModal from '../../components/EditProductListModal/EditProductListModal';
import { ModifyInvProductsModalModel } from '../../models/modal.models';
import { getCategoryName } from '../../helpers/categories.helper';

interface InventoryProps {}

const Inventory: FC<InventoryProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const reload = useAppSelector(reloadReportsTable);
  const currentInventoryReport = useAppSelector(activeInventoryReport);
  const packagesReport = useAppSelector(activePackagesReport);
  const inventoryConfirmation = useAppSelector(actionAccepted);
  const newReport = useAppSelector(newReportModel);
  const searchText = useAppSelector(gridSearchText);
  const categoryFilter = useAppSelector(gridCategoryFilter);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const activeOrgCampaign = useAppSelector(activeCampaign);
  const gridFilter = useAppSelector(gridCategoryFilter);

  const [displayInventory, setDisplayInventory] = useState<ReportProductModel[]>([]);
  const [orderByColumn, setOrderByColumn] = useState<string>(GRID_SORT_ENUM.NAME);
  const [categoryName, setCategory] = useState<string>("");

  useEffect(() => {
    if (userMetadata && activeOrgCampaign) {
      const orgId = userMetadata?.orgId as string;
      const campaignId = activeOrgCampaign?.campaignId as string;
  
      dispatch(getActiveInventoryReportsAsync({db, orgId, campaignId}));
      dispatch(getAllProductsAsync({db, orgId}));
    }

    return () => {
      dispatch(setGridSearchText(null));
      dispatch(setGridCategoryFilter(null));
    }
  }, [userMetadata, activeOrgCampaign]);

  useEffect(() => {
    if (reload) {
      const orgId = userMetadata?.orgId as string;
      const campaignId = activeOrgCampaign?.campaignId as string;

      dispatch(setReloadReportsTable());
      dispatch(getActiveInventoryReportsAsync({db, orgId, campaignId}));
    }
  }, [reload]);

  useEffect(() => { 
    if (currentInventoryReport) {
      const sortedInventory = currentInventoryReport.inventory.map(product => {
        return {...product, type: getCategoryName(product.type)};
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
      const orgId = userMetadata?.orgId as string;
      const campaignId = activeOrgCampaign?.campaignId as string;

      dispatch(setActionAccepted());
      dispatch(closeCurrentReportAsync({db, orgId, campaignId}));
    }
  }, [inventoryConfirmation]);
  
  useEffect(() => {
    if (newReport) {
      let inventory: ReportProductModel[] = [];
      const { v4: uuidv4 } = require('uuid');
      const uid =  uuidv4();
      const orgId = userMetadata?.orgId as string;
      const campaignId = activeOrgCampaign?.campaignId as string;

      newReport.selectedProuducts?.map(p => {
        let reportProductModel: ReportProductModel = {
          uid: p.uid,
          name: p.name,
          unit: p.unit,
          referencePrice: p.referencePrice,
          type: p.type,
          totalPrice: 0,
          quantity: 0,
          orgId: p.orgId
        }

        inventory.push(reportProductModel);
      });

      defaultInventoryReportModel.uid = uid;
      defaultInventoryReportModel.inventory = inventory;
      defaultInventoryReportModel.name = newReport.reportName;
      defaultInventoryReportModel.orgId = userMetadata?.orgId as string;
      defaultInventoryReportModel.campaignId = activeOrgCampaign?.campaignId as string;
      
      defaulPackagesReportModel.uid = uid;
      defaulPackagesReportModel.name = newReport.reportName;
      defaulPackagesReportModel.orgId = userMetadata?.orgId as string;
      defaulPackagesReportModel.campaignId = activeOrgCampaign?.campaignId as string;

      let inventoryReport = defaultInventoryReportModel;
      let packagesReport = defaulPackagesReportModel;

      dispatch(createActiveReportAsync({db, inventoryReport, packagesReport, orgId, campaignId}));
      dispatch(setNewReportModel(null));      
    }
  }, [newReport])

  useEffect(() => {
    gridFilter ? setCategory(gridFilter) : setCategory(appLabels.get("all") as string);
  }, [gridFilter])

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
    dowloadReport("inventory-table", activeOrgCampaign?.name as string, currentInventoryReport, packagesReport, categoryFilter);
  }

  const showCreateNewReportModal = () => {
    dispatch(setNewReportModal());
  }

  const modifyProductList = () => {
    const modalModel: ModifyInvProductsModalModel = {
      showModal: true,
      inventoryProducts: currentInventoryReport?.inventory as ReportProductModel[]
    }

    dispatch(setModifyInvProductsModalModel(modalModel));  
  }

  const sortAfterColumn = (sortColumn: string) => {
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
              <h4>{appLabels.get("currentInventory")}: {currentInventoryReport.name}</h4>
              {
                userHasAccess() &&
                <div className="button-container">
                  <Button className="add-button" color="danger" onClick={() => showCloseConfirmationModal()}>{appLabels.get("closeCurrentInventory")}</Button>
                  <Button className="add-button" color="primary" onClick={() => downloadReport()}>{appLabels.get("downloadIntemReport") + (categoryName !== "" ? ` (${categoryName})` : "")}</Button>
                </div>
              }
            </CardTitle>
            <CardSubtitle>
              <h6>{appLabels.get("period")}: {convertTimeStampToDateString(currentInventoryReport?.fromDate.seconds as number)} - {getCurrentDateString()}</h6>
              </CardSubtitle>
            <div className="inventory-table-header">
              <GridSearch />
              <GridCategoryFilter />
              { userHasAccess() && 
              <Button onClick={() => modifyProductList()} className="modify-product-list" outline color="danger">{appLabels.get("modifyProductList")}</Button> }
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
                      <span>{appLabels.get("inventoryGridProduct")}</span>
                    </th>
                    <th className="grid-header-category" onClick={() => sortAfterColumn(GRID_SORT_ENUM.TYPE)}>
                      {
                        orderByColumn === GRID_SORT_ENUM.TYPE && <i className="bi bi-arrow-up"></i> 
                      }
                      <span>{appLabels.get("inventoryGridCategory")}</span>
                    </th>
                    { userHasAccess() && <th>{appLabels.get("inventoryGridReferencePrice")}</th> }
                    <th>{appLabels.get("inventoryGridQty")}</th>
                    <th>{appLabels.get("inventoryGridUnit")}</th>
                    { userHasAccess() && <th>{appLabels.get("inventoryGridTotalPrice")}</th> }
                    <th className="table-centered-cell">{appLabels.get("inventoryGridDeleteQty")}</th>
                    <th className="table-centered-cell">{appLabels.get("inventoryGridAddQty")}</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    displayInventory.map((product, index) => (
                    <tr key={product.name}>
                      <th scope="row">{index + 1}</th>
                      <td>{product.name}</td>
                      <td>{product.type}</td>
                      { userHasAccess() && <td>{product.referencePrice }</td> }
                      <td>{(Math.round(product.quantity * 100) / 100).toFixed(2)}</td>
                      <td>{product.unit}</td>
                      { userHasAccess() && <td>{(Math.round(product.totalPrice * 100) / 100).toFixed(2)}</td> }
                      <td className="table-centered-cell"><i onClick={() => openRemoveQtyModal(product)} className="bi bi-dash-circle" title="Șterge cantitate"></i></td>
                      <td className="table-centered-cell"><i onClick={() => openAddQtyModal(product)} className="bi bi-plus-circle" title="Adaugă cantitate"></i></td>
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
        <EditProductListModal />
      </div>
    );
  }

  return (      
    <div className="products-container">
      <Card>
      <CardBody>
        { userHasAccess() ?  
          <CardTitle className="card-title">
            <h4>{appMessages.get("noActiveInventoryAdmin")}</h4>
            <div className="button-container">
              <Button className="add-button" color="primary" onClick={() => showCreateNewReportModal()}>{appLabels.get("newInventory")}</Button>
            </div>
          </CardTitle>   
        : 
          <CardTitle className="card-title">
            <h4>{appMessages.get("noActiveInventory")}</h4>
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