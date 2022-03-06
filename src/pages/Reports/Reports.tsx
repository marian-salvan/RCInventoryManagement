import React, { FC } from 'react';
import styles from './Reports.module.css';

interface ReportsProps {}

const Reports: FC<ReportsProps> = () => (
  <div className={styles.Reports}>
    Reports Component
  </div>
);

export default Reports;
