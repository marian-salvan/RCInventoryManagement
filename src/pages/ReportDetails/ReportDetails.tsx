import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Table } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import GridCategoryFilter from '../../components/GridCategoryFilter/GridCategoryFilter';
import QuantityModal from '../../components/QuantityModal/QuantityModal';
import { GRID_SORT_ENUM } from '../../constants/grid.constants';
import { appLabels } from '../../constants/messages.constants';
import { productTypesEngToRoMap } from '../../constants/product-types.constants';
import { convertTimeStampToDateString } from '../../helpers/date.helper';
import { dowloadReport } from '../../helpers/reports.helper';
import { getProductModelSortingFunc } from '../../helpers/sorting.helper';
import { ReportProductModel } from '../../models/reports.models';
import { activeCampaign, fireStoreDatabase, gridCategoryFilter, loggedInUserMetadata, selectedInventoryReport, selectedPackageReport, setGridCategoryFilter} from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getInventoryReportsByUidAsync } from '../../thunks/inventory-reports.thunk';
import { getPackagesReportsByUidAsync } from '../../thunks/packages-reports.thunk';
import  './ReportDetails.css';

interface ReportDetailsProps {}

const ReportDetails: FC<ReportDetailsProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const inventoryReport = useAppSelector(selectedInventoryReport);
  const packagesReport = useAppSelector(selectedPackageReport);
  const categoryFilter = useAppSelector(gridCategoryFilter);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const activeOrgCampaign = useAppSelector(activeCampaign);
  const gridFilter = useAppSelector(gridCategoryFilter);

  const [displayInventory, setDisplayInventory] = useState<ReportProductModel[]>([]);
  const [categoryName, setCategory] = useState<string>("");

  const { reportId } = useParams();

  useEffect(() => {
    if (reportId && activeOrgCampaign) {
      const uid = reportId as string;
      const orgId = userMetadata?.orgId as string;
      const campaignId = activeOrgCampaign?.campaignId as string;

      dispatch(getInventoryReportsByUidAsync({db, uid, orgId, campaignId}));
      dispatch(getPackagesReportsByUidAsync({db, uid, orgId, campaignId}));
    }

    return () => {
      dispatch(setGridCategoryFilter(null));
    }
  }, [reportId, activeOrgCampaign])

  useEffect(() => {
    if (inventoryReport) {
      const reports = inventoryReport.inventory.map(product => {
        return {...product, type: productTypesEngToRoMap.get(product.type) as string};
      }).sort(getProductModelSortingFunc(GRID_SORT_ENUM.TYPE));

      (categoryFilter !== null) ? setDisplayInventory(reports.filter(x => x.type === categoryFilter)) :
                                  setDisplayInventory(reports);
    }
  }, [inventoryReport, categoryFilter])

  useEffect(() => {
    gridFilter ? setCategory(gridFilter) : setCategory(appLabels.get("all") as string);
  }, [gridFilter])
  
  
  const downloadReport = () => {
    dowloadReport("report-table", activeOrgCampaign?.name as string, inventoryReport, packagesReport, categoryFilter);
  }

  const getAverageQty = (): string => {
    if (packagesReport && packagesReport.packages.quantity > 0 && packagesReport.packages.totalPackages > 0) {
      return (Math.round((packagesReport.packages.quantity / packagesReport.packages.totalPackages) * 100) / 100).toFixed(2);
    }

    return "0.00";
  }

  return ( 
    <div className="products-container">
       <Card>
        <CardBody>
          <CardTitle className="card-title">
            <h4>{appLabels.get("inventory")}: {inventoryReport?.name}</h4>
            <div className="button-container">
              <Button className="add-button" color="primary" 
                      onClick={() => downloadReport()}>{appLabels.get("downloadReport") + (categoryName !== "" ? ` (${categoryName})` : "") }
              </Button>
            </div>
          </CardTitle>
          <CardSubtitle>
            <h6>{appLabels.get("period")}: {convertTimeStampToDateString(inventoryReport?.fromDate.seconds as number)} - {convertTimeStampToDateString(inventoryReport?.toDate?.seconds as number)}</h6>
            <h6>{appLabels.get("packagesTotal")}: {(Math.round(packagesReport?.packages.totalPackages as number * 100) / 100).toFixed(2)  } </h6>
            <h6>{appLabels.get("packagesQty")}: {(Math.round(packagesReport?.packages.quantity as number * 100) / 100).toFixed(2)} (KG)</h6>
            <h6>{appLabels.get("packagesAvgQty")}: {getAverageQty()} (KG)</h6>
          </CardSubtitle>
          <div className="report-details-table-header">
              <GridCategoryFilter />
            </div>
          <div className="details-table-container">
            <Table hover className="products-table" id="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{appLabels.get("inventoryGridProduct")}</th>
                  <th>
                    <i className="bi bi-arrow-up"></i>
                    <span>{appLabels.get("inventoryGridCategory")}</span>
                  </th>
                  <th>{appLabels.get("inventoryGridUnit")}</th>
                  <th>{appLabels.get("inventoryGridReferencePrice")}</th>
                  <th>{appLabels.get("inventoryGridTotalQty")}</th>
                  <th>{appLabels.get("inventoryGridTotalPrice")}</th>
                </tr>
              </thead>
              <tbody>
                {
                  displayInventory.map((product, index) => (
                  <tr key={product.name}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.name}</td>
                    <th>{product.type}</th>
                    <td>{product.unit}</td>
                    <td>{product.referencePrice}</td>
                    <td>{(Math.round(product.quantity * 100) / 100).toFixed(2)}</td>
                    <td>{(Math.round(product.totalPrice * 100) / 100).toFixed(2)}</td>
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
export default ReportDetails;
