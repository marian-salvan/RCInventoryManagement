import React, { FC } from 'react';
import styles from './PackageManagement.module.css';

interface PackageManagementProps {}

const PackageManagement: FC<PackageManagementProps> = () => (
  <div className={styles.PackageManagement}>
    PackageManagement Component
  </div>
);

export default PackageManagement;
