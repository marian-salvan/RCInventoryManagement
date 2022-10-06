import React, { FC, useEffect } from 'react';
import { Table } from 'reactstrap';
import { appLabels, appMessages } from '../../constants/messages.constants';
import { productTypesEngToRoMap } from '../../constants/product-types.constants';
import { getCategoryName } from '../../helpers/categories.helper';
import { CategoryModel } from '../../models/categories.models';
import { actionAccepted, allCategories, categoryToBeDeleted, fireStoreDatabase, loggedInUserMetadata,
   reloadProductsTable,
   setActionAccepted,
   setAddEditCategoryModalModel,
   setCategoryToBeDeleted, setConfirmationModal, setConfirmationModalModel, setReloadProductsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { deleteCategoryAsync, getAllCategoriesAsync } from '../../thunks/categories.thunk';
import AddEditCategoryModal from '../AddEditCategoryModal/AddEditCategoryModal';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import './CategoriesTab.css';

interface CategoriesTabProps {}

const CategoriesTab: FC<CategoriesTabProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const userMetadata = useAppSelector(loggedInUserMetadata);
  const categories = useAppSelector(allCategories);
  const categToBeDelted = useAppSelector(categoryToBeDeleted);
  const deleteConfirmation = useAppSelector(actionAccepted);
  const reload = useAppSelector(reloadProductsTable);
  
  useEffect(() => {
    if (userMetadata) {
      const orgId = userMetadata.orgId;
      dispatch(getAllCategoriesAsync({db, orgId}));
    }
  }, [userMetadata])

  useEffect(() => {
    if (reload) {
      const orgId = userMetadata?.orgId as string;

      dispatch(setReloadProductsTable());
      dispatch(getAllCategoriesAsync({db, orgId}));
    }
  }, [reload]);

  useEffect(() => {
    if (deleteConfirmation) {
      dispatch(setActionAccepted());

      if (categToBeDelted) {
        const categoryModel = categToBeDelted;
        dispatch(deleteCategoryAsync({db, categoryModel}));
      }
    }
  }, [deleteConfirmation])

  const deleteCategory = (category: CategoryModel) => {
    dispatch(setConfirmationModalModel({
      title: appMessages.get("deleteCategoryModalTitle") as string,
      message: appMessages.get("deleteCategoryModalMessage") as string,
      buttonColor: "danger"
    }));
    dispatch(setConfirmationModal());

    dispatch(setCategoryToBeDeleted(category));
  }

  const editCategory = (category: CategoryModel) => {
    dispatch(setAddEditCategoryModalModel({
      showModal: true,
      categoryModel: category
    }));
  }
  
  return (
    <div className="table-container">
      <Table hover className="categories-table" id="categories-table">
        <thead>
          <tr>
            <th>#</th>
            <th className="table-centered-cell">{appLabels.get("categoryName")}</th>
            <th className="table-centered-cell">{appLabels.get("deleteCategory")}</th>
            <th className="table-centered-cell">{appLabels.get("editCategory")}</th>
          </tr>
        </thead>
        <tbody>
        {
          categories?.map((category, index) => (
          <tr key={category.name}>
            <th scope="row">{index + 1}</th>
            <td>{getCategoryName(category.name)}</td>
            <td className="table-centered-cell"><i onClick={() => deleteCategory(category)} className="bi bi-x-circle" title={appLabels.get("deleteCategory")}></i></td>
            <td className="table-centered-cell"><i onClick={() => editCategory(category)} className="bi bi-pencil-fill" title={appLabels.get("editCategory")}></i></td>
          </tr>
          ))
        }
      </tbody>
      </Table> 
      <ConfirmationModal />
      <AddEditCategoryModal />
    </div>
  )
}

export default CategoriesTab;
