import React, { FC } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import './GridCategoryFilter.css';

interface GridCategoryFilterProps {}

const GridCategoryFilter: FC<GridCategoryFilterProps> = () => {

  return (
    <div className="grid-category-filter-container">
      <Input type="select" name="type" id="category-filter" className="category-filter">
          <option hidden value="">Selectează categoria</option>
          <option value="">Toate</option>    
      </Input>
    </div>
  );
}

export default GridCategoryFilter;
