import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Table } from 'reactstrap';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import QuantityModal from '../../components/QuantityModal/QuantityModal';
import { productTypesEngToRoMap } from '../../constants/product-types.constants';
import { convertTimeStampToDateString, getCurrentDateString } from '../../helpers/date.helper';
import { ReportProductModel } from '../../models/reports.models';
import { fireStoreDatabase, selectedInventoryReport, selectedPackageReport} from '../../reducers/app.reducer';
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

  const [displayInventory, setDisplayInventory] = useState<ReportProductModel[]>([]);

  const { reportId } = useParams();

  useEffect(() => {
    if (reportId) {
      const uid = reportId as string;

      dispatch(getInventoryReportsByUidAsync({db, uid}));
      dispatch(getPackagesReportsByUidAsync({db, uid}));
    }
  }, [reportId])

  useEffect(() => {
    if (inventoryReport) {
      const reports = inventoryReport.inventory.map(product => {
        return {...product, type: productTypesEngToRoMap.get(product.type) as string};
      });

      setDisplayInventory(reports.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0)));
    }
  }, [inventoryReport])
  
  const downloadReport = () => {
    var XLSX = require("xlsx");
    var workbook = XLSX.utils.book_new();

    var sheet1 = XLSX.utils.table_to_sheet(document.getElementById("report-table"));
    XLSX.utils.book_append_sheet(workbook, sheet1, "Sheet1");

    var sheet2 = XLSX.utils.aoa_to_sheet([
      ["Data de început", inventoryReport?.fromDate.toDate().toLocaleDateString()],
      ["Data de final", inventoryReport?.toDate?.toDate().toLocaleDateString()],
      ["Total pachete", packagesReport?.packages.totalPackages],
      ["Cantitate pachete (KG)", packagesReport?.packages.quantity]
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet2, "Sheet2");

    XLSX.writeFile(workbook, `${inventoryReport?.name}.xlsx`);
  }

  return ( 
    <div className="products-container">
       <Card>
        <CardBody>
          <CardTitle className="card-title">
            <h4>Inventar: {inventoryReport?.name}</h4>
            <div className="button-container">
              <Button className="add-button" color="primary" onClick={() => downloadReport()}>Descarcă raportul</Button>
            </div>
          </CardTitle>
          <CardSubtitle>
            <h6>Perioada: {convertTimeStampToDateString(inventoryReport?.fromDate.seconds as number)} - {getCurrentDateString()}</h6>
            <h6>Nr total de pachete: {(Math.round(packagesReport?.packages.totalPackages as number * 100) / 100).toFixed(2)  } </h6>
            <h6>Cantitate : {(Math.round(packagesReport?.packages.quantity as number * 100) / 100).toFixed(2)} (KG)</h6>
          </CardSubtitle>
          <div className="table-container">
            <Table hover className="products-table" id="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nume produs</th>
                  <th>Categorie</th>
                  <th>Unitate de măsură</th>
                  <th>Preț de referință</th>
                  <th>Cantitate totată</th>
                  <th>Preț total</th>
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
