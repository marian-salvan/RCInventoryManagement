import React, { FC } from 'react';
import styles from './Products.module.css';

interface ProductsProps {}

const Products: FC<ProductsProps> = () => (
  <div className={styles.Products}>
    Products Component
  </div>
);

export default Products;
