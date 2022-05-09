import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Table } from 'reactstrap';
import AddEditProductModal from '../../components/AddEditProductModal/AddEditProductModal';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import GridSearch from '../../components/GridSearch/GridSearch';
import { appLabels, appMessages } from '../../constants/messages.constants';
import { productTypesEngToRoMap } from '../../constants/product-types.constants';
import { ROLES } from '../../constants/roles.enums';
import { ProductModel } from '../../models/products.models';
import { actionAccepted, allProducts, fireStoreDatabase, gridSearchText, loggedInUserMetadata,
   productToBeAdded, reloadProductsTable, setActionAccepted, setAddEditProductModal, setConfirmationModal,
   setConfirmationModalModel, setGridSearchText, setProductToBeAdded, setProductToBeEdited, setReloadProductsTable } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { createProductAsync, deleteProductAsync, getAllProductsAsync } from '../../thunks/products.thunk';
import './Products.css';

interface ProductsProps {}

const Products: FC<ProductsProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const products = useAppSelector(allProducts);
  const deleteConfirmation = useAppSelector(actionAccepted);
  const newProduct = useAppSelector(productToBeAdded);
  const reload = useAppSelector(reloadProductsTable);
  const searchText = useAppSelector(gridSearchText);
  const userMetadata = useAppSelector(loggedInUserMetadata);

  const [productToBeDeleted, setProductToBeDeleted] = useState<ProductModel | null>(null);
  const [displayProducts, setDisplayProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    if (userMetadata) {
      const orgId = userMetadata?.orgId as string;

      dispatch(getAllProductsAsync({db, orgId}));
    }

    return () => {
      dispatch(setGridSearchText(null));
    }
  }, [userMetadata]);

  useEffect(() => {
    if (products) {
      (searchText !== null) ? setDisplayProducts(products.filter(x => x.name.includes(searchText))) :
                              setDisplayProducts(products); 
    }

  }, [products, searchText]);

  useEffect(() => {
    if (reload) {
      const orgId = userMetadata?.orgId as string;

      dispatch(setReloadProductsTable());
      dispatch(getAllProductsAsync({db, orgId}));
    }
  }, [reload]);

  useEffect(() => {
    if (deleteConfirmation) {
      dispatch(setActionAccepted());

      if (productToBeDeleted) {
        const uid = productToBeDeleted.uid;
        const orgId = userMetadata?.orgId as string

        dispatch(deleteProductAsync({db, uid, orgId}));
      }
    }
  }, [deleteConfirmation])

  useEffect(() => {
    if (newProduct) {
      const product = newProduct as ProductModel;

      dispatch(createProductAsync({db, product}));
      dispatch(setProductToBeAdded(null));
    }
  }, [newProduct])

  const deleteProduct = (product: ProductModel) => {
    dispatch(setConfirmationModalModel({
      title: appMessages.get("deleteProductModalTitle") as string,
      message: appMessages.get("deleteProductModalMessage") as string,
      buttonColor: "danger"
    }));
    dispatch(setConfirmationModal());

    setProductToBeDeleted(product);
  }

  const editProduct = (product: ProductModel) => {
    dispatch(setProductToBeEdited(product));
    dispatch(setAddEditProductModal(false));
  }
  
  const showAddModal = () => {
    dispatch(setAddEditProductModal(true));
  }

  const userHasAccess = (): boolean => {
    return userMetadata?.role === ROLES.ADMIN;
  } 

  return ( 
    <div className="products-container">
       <Card>
        <CardBody>
          <CardTitle className="card-title">
            <h4>{appLabels.get("productList")}</h4>
            <div className="button-container">
            { userHasAccess() && <Button className="add-button" color="primary" onClick={() => showAddModal()}>{appLabels.get("addProduct")}</Button> }
            </div>
          </CardTitle>  
          <GridSearch />
          <div className="table-container">
            <Table hover className="products-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>
                    <i className="bi bi-arrow-up"></i>
                    <span>{appLabels.get("inventoryGridProduct")}</span>
                  </th>
                  <th>{appLabels.get("inventoryGridCategory")}</th>
                  { userHasAccess() && <th>{appLabels.get("inventoryGridReferencePrice")}</th> }
                  <th>{appLabels.get("inventoryGridUnit")}</th>
                  { userHasAccess() && <th className="table-centered-cell">{appLabels.get("deleteProduct")}</th> }
                  { userHasAccess() && <th className="table-centered-cell">{appLabels.get("editProduct")}</th> }
                </tr>
              </thead>
              <tbody>
                {
                  displayProducts?.map((product, index) => (
                  <tr key={product.name}>
                    <th scope="row">{index + 1}</th>
                    <td>{product.name}</td>
                    <td>{productTypesEngToRoMap.get(product.type)}</td>
                    { userHasAccess() && <td>{product.referencePrice}</td> }
                    <td>{product.unit}</td>
                    { userHasAccess() && <td className="table-centered-cell"><i onClick={() => deleteProduct(product)} className="bi bi-x-circle" title={appLabels.get("deleteProduct")}></i></td> }
                    { userHasAccess() && <td className="table-centered-cell"><i onClick={() => editProduct(product)} className="bi bi-pencil-fill" title={appLabels.get("editProduct")}></i></td> }
                  </tr>
                  ))
                }
              </tbody>
            </Table> 
          </div> 
        </CardBody>
      </Card>
      <AddEditProductModal />
      <ConfirmationModal />
    </div>
  );
}

export default Products;
