import React, { FC } from 'react';
import styles from './CreateInventoryModal.module.css';

interface CreateInventoryModalProps {}

const CreateInventoryModal: FC<CreateInventoryModalProps> = () => (
  <div className={styles.CreateInventoryModal}>
    CreateInventoryModal Component
  </div>
);

export default CreateInventoryModal;
