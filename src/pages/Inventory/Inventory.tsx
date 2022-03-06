import React, { FC } from 'react';
import styles from './Inventory.module.css';

interface InventoryProps {}

const Inventory: FC<InventoryProps> = () => (
  <div className={styles.Inventory}>
    Inventory Component
  </div>
);

export default Inventory;
