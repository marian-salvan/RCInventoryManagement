import { FC, useEffect } from 'react';
import { Card, CardBody, CardTitle, Table } from 'reactstrap';
import {  fireStoreDatabase, inactiveInventoryReports} from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import  './Reports.css';
import { getInactiveInventoryReportsAsync } from '../../thunks/inventory-reports.thunk';
import { useNavigate } from 'react-router-dom';

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
    navigate(`/reports/${uid}`, { replace: true });
  }

  return ( 
    <div className="products-container">
       <Card>
        <CardBody>
          <CardTitle className="card-title">
            <h4>Rapoarte disponibile</h4>
          </CardTitle>
          <div className="table-container">
            <Table hover className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nume inventar</th>
                  <th>Data deschiderii</th>
                  <th>Data închidere</th>
                  <th>Vezi raportul</th>
                </tr>
              </thead>
              <tbody>
                {
                  inactiveReports?.map((report, index) => (
                  <tr key={report.name}>
                    <td scope="row">{index + 1}</td>
                    <td>{report.name}</td>
                    <td>{report.fromDate.toDate().toLocaleDateString()}</td>
                    <td>{report.toDate?.toDate().toLocaleDateString()}</td>
                    <td onClick={() => navigateToReportDetails(report.uid)}><i className="bi bi-file" title="Vezi raportul"></i></td>
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
