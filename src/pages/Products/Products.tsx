import { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Table } from 'reactstrap';
import AddProductModal from '../../components/AddProductModal/AddProductModal';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import GridSearch from '../../components/GridSearch/GridSearch';
import { appMessages } from '../../constants/messages.constants';
import { productTypesEngToRoMap } from '../../constants/product-types.constants';
import { ROLES } from '../../constants/roles.enums';
import { ProductModel } from '../../models/products.models';
import { actionAccepted, allProducts, fireStoreDatabase, gridSearchText, loggedInUserMetadata, productToBeAdded, reloadProductsTable, setActionAccepted, setAddProductModal, setConfirmationModal, setConfirmationModalModel, setGridSearchText, setProductToBeAdded, setReloadProductsTable } from '../../reducers/app.reducer';
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
    dispatch(getAllProductsAsync(db));

    return () => {
      dispatch(setGridSearchText(null));
    }
  }, []);

  useEffect(() => {
    if (products) {
      (searchText !== null) ? setDisplayProducts(products.filter(x => x.name.includes(searchText))) :
                              setDisplayProducts(products); 
    }

  }, [products, searchText]);

  useEffect(() => {
    if (reload) {
      dispatch(setReloadProductsTable());
      dispatch(getAllProductsAsync(db));
    }

  }, [reload]);

  useEffect(() => {
    if (deleteConfirmation) {
      dispatch(setActionAccepted());

      if (productToBeDeleted) {
        const uid = productToBeDeleted.uid;
        dispatch(deleteProductAsync({db, uid}));
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
      message: appMessages.get("deleteProductModalMessage") as string 
    }));
    dispatch(setConfirmationModal());

    setProductToBeDeleted(product);
  }

  const showAddModal = () => {
    dispatch(setAddProductModal());
  }

  const userHasAccess = (): boolean => {
    return userMetadata?.role == ROLES.ADMIN;
  } 

  return ( 
    <div className="products-container">
       <Card>
        <CardBody>
          <CardTitle className="card-title">
            <h4>Lista de produse</h4>
            <div className="button-container">
            { userHasAccess() && <Button className="add-button" color="primary" onClick={() => showAddModal()}>Adaugă produs</Button> }
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
                    <span>Nume produs </span>
                  </th>
                  <th>Categorie</th>
                  { userHasAccess() && <th>Preț de referință</th> }
                  <th>Unitate de măsură</th>
                  { userHasAccess() && <th>Șterge Produs</th> }
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
                    { userHasAccess() &&  <td onClick={() => deleteProduct(product)}><i className=" bi bi-dash-circle" title="Șterge Produs"></i></td> }
                  </tr>
                  ))
                }
              </tbody>
            </Table> 
          </div> 
        </CardBody>
      </Card>
      <AddProductModal />
      <ConfirmationModal />
    </div>
  );
}

export default Products;
