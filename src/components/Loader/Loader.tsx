import React, { FC } from 'react';
import { Spinner } from 'reactstrap';
import './Loader.css';

interface LoaderProps {}

const Loader: FC<LoaderProps> = () => (
  <div className="loader-container">
    <Spinner animation="border" role="status" className="loader">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export default Loader;
