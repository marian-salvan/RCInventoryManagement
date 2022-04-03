import { FC, useEffect } from 'react';
import { Card, CardBody, CardTitle, Table } from 'reactstrap';
import {  fireStoreDatabase, inactiveInventoryReports} from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import  './Reports.css';
import { getInactiveInventoryReportsAsync } from '../../thunks/inventory-reports.thunk';
import { useNavigate } from 'react-router-dom';
import { appLabels } from '../../constants/messages.constants';

interface ReportsProps {}

const Reports: FC<ReportsProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const db = useAppSelector(fireStoreDatabase);
  const inactiveReports = useAppSelector(inactiveInventoryReports);

  useEffect(() => {
    dispatch(getInactiveInventoryReportsAsync(db));
  }, [])
  
  const navigateToReportDetails = (uid: string) => {
    navigate(`/reports/${uid}`, { replace: false });
  }

  return ( 
    <div className="products-container">
       <Card>
        <CardBody>
          <CardTitle className="card-title">
            <h4>{appLabels.get("reportsTitle")}</h4>
          </CardTitle>
          <div className="table-container">
            <Table hover className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{appLabels.get("reportsGridInventory")}</th>
                  <th>{appLabels.get("reportsGridOpenDate")}</th>
                  <th>{appLabels.get("reportsGridCloseDate")}</th>
                  <th>{appLabels.get("reportsGridSeeReport")}</th>
                </tr>
              </thead>
              <tbody>
                {
                  inactiveReports?.map((report, index) => (
                  <tr key={report.name}>
                    <td scope="row">{index + 1}</td>
                    <td>{report.name}</td>
                    <td>{report.fromDate.toDate().toLocaleDateString("ro-RO")}</td>
                    <td>{report.toDate?.toDate().toLocaleDateString("ro-RO")}</td>
                    <td onClick={() => navigateToReportDetails(report.uid)}><i className="bi bi-eye" title="Vezi raportul"></i></td>
                  </tr>
                  ))
                }
              </tbody>
            </Table> 
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Reports;
