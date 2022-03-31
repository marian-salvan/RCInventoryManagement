import React, { FC } from 'react';
import { Spinner } from 'reactstrap';
import { appMessages } from '../../constants/messages.constants';
import './Loader.css';

interface LoaderProps {}

const Loader: FC<LoaderProps> = () => (
  <div className="loader-container">
    <Spinner animation="border" role="status" className="loader">
      <span className="visually-hidden">{appMessages.get("loading")}...</span>
    </Spinner>
  </div>
);

export default Loader;
