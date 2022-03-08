import { FC } from 'react';
import './AccessDenied.css';

interface AccessDeniedProps {}

const AccessDenied: FC<AccessDeniedProps> = () => (
  <div>
    <span>Nu ai access la această pagină</span>
  </div>
);

export default AccessDenied;
