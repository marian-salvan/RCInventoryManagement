import React, { FC, useEffect } from 'react';
import { Table } from 'reactstrap';
import { appLabels, appMessages } from '../../constants/messages.constants';
import { UnitModel } from '../../models/units.models';
import { actionAccepted, allUnits, fireStoreDatabase, loggedInUserMetadata, reloadProductsTable, setActionAccepted, setAddEditUnitModalModel, setConfirmationModal, setConfirmationModalModel, setReloadProductsTable, setUnitToBeDeleted, unitToBeDeleted } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { deleteUnitAsync, getAllUnitsAsync } from '../../thunks/units.thunk';
import AddEditUnitModal from '../AddEditUnitModal/AddEditUnitModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './UnitsTab.css';

interface UnitsTabProps {}

const UnitsTab: FC<UnitsTabProps> = () =>  {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const units = useAppSelector(allUnits);
  const unToBeDelted = useAppSelector(unitToBeDeleted);
  const deleteConfirmation = useAppSelector(actionAccepted);
  const reload = useAppSelector(reloadProductsTable);
  
  useEffect(() => {
    if (userMetadata) {
      const orgId = userMetadata.orgId;
      dispatch(getAllUnitsAsync({db, orgId}));
    }
  }, [userMetadata])
  
  useEffect(() => {
    if (reload) {
      const orgId = userMetadata?.orgId as string;

      dispatch(setReloadProductsTable());
      dispatch(getAllUnitsAsync({db, orgId}));
    }
  }, [reload]);

  useEffect(() => {
    if (deleteConfirmation) {
      dispatch(setActionAccepted());

      if (unToBeDelted) {
        const unitModel = unToBeDelted;
        dispatch(deleteUnitAsync({db, unitModel}));
      }
    }
  }, [deleteConfirmation])

  const deleteUnit = (unit: UnitModel) => {
    dispatch(setConfirmationModalModel({
      title: appMessages.get("deleteUnitModalTitle") as string,
      message: appMessages.get("deleteUnitModalMessage") as string,
      buttonColor: "danger"
    }));
    dispatch(setConfirmationModal());
    dispatch(setUnitToBeDeleted(unit));
  }

  const editUnit = (unit: UnitModel) => {
    dispatch(setAddEditUnitModalModel({
      showModal: true,
      unitModel: unit
    }));
  }

  return (
    <div className="table-container">
      <Table hover className="categories-table" id="categories-table">
        <thead>
          <tr>
            <th>#</th>
            <th className="table-centered-cell">{appLabels.get("unitName")}</th>
            <th className="table-centered-cell">{appLabels.get("deleteUnit")}</th>
            <th className="table-centered-cell">{appLabels.get("editUnit")}</th>
          </tr>
        </thead>
        <tbody>
        {
          units?.map((unit, index) => (
          <tr key={unit.name}>
            <th scope="row">{index + 1}</th>
            <td>{unit.name}</td>
            <td className="table-centered-cell"><i onClick={() => deleteUnit(unit)} className="bi bi-x-circle" title={appLabels.get("deleteUnit")}></i></td>
            <td className="table-centered-cell"><i onClick={() => editUnit(unit)} className="bi bi-pencil-fill" title={appLabels.get("editUnit")}></i></td>
          </tr>
          ))
        }
        </tbody>
      </Table>
      <ConfirmationModal />
      <AddEditUnitModal /> 
  </div>
  )
}

export default UnitsTab;
