import React, { FC, useEffect, useState } from 'react';
import { Button, Card, CardBody, CardTitle, Table } from 'reactstrap';
import AddProductModal from '../../components/AddProductModal/AddProductModal';
import { ProductModel } from '../../models/products.models';
import { allProducts, fireStoreDatabase, setAddProductModal, showAddProductModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { getAllProductsAsync } from '../../thunks/products.thunk';
import './Products.css';

interface ProductsProps {}

const Products: FC<ProductsProps> = () => {
  const dispatch = useAppDispatch();
  const db = useAppSelector(fireStoreDatabase);
  const products = useAppSelector(allProducts);

  useEffect(() => {
    dispatch(getAllProductsAsync(db));
  }, []);

  const deleteProduct = (product: ProductModel) => {
    console.log(product)
  }

  const showAddModal = () => {
    dispatch(setAddProductModal());
  }

  return ( 
    <div className="products-container">
       <Card>
        <CardBody>
          <CardTitle className="card-title">
            <h4>Lista de produse</h4>
            <div className="button-container">
              <Button className="add-button" color="primary" onClick={() => showAddModal()}>Adaugă produs</Button>
            </div>
          </CardTitle>
        
          <Table hover className="products-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nume produs</th>
                <th>Preț de referință</th>
                <th>Unitate de măsură</th>
                <th>Șterge Produs</th>
              </tr>
            </thead>
            <tbody>
              {
                products?.map((product, index) => (
                <tr key={product.name}>
                  <th scope="row">{index}</th>
                  <td>{product.name}</td>
                  <td>{product.referencePrice}</td>
                  <td>{product.unit}</td>
                  <td onClick={() => deleteProduct(product)}><i className="bi bi-dash-circle"></i></td>
                </tr>
                ))
              }
            </tbody>
          </Table> 
        </CardBody>
      </Card>
      <AddProductModal />
    </div>
  );
}


export default Products;
