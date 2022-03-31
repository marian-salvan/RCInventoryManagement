import React, { FC } from 'react';
import { Input } from 'reactstrap';
import { appLabels } from '../../constants/messages.constants';
import { productTypesOptions } from '../../constants/product-types.constants';
import { setGridCategoryFilter } from '../../reducers/app.reducer';
import { useAppDispatch } from '../../stores/hooks';
import './GridCategoryFilter.css';

interface GridCategoryFilterProps {}

const GridCategoryFilter: FC<GridCategoryFilterProps> = () => {
  const dispatch = useAppDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as string;

    if (value && value !== "") {
      dispatch(setGridCategoryFilter(value));
    } else {
      dispatch(setGridCategoryFilter(null));
    }
  }

  return (
    <div className="grid-category-filter-container">
      <Input type="select" name="type" id="category-filter" className="category-filter" onChange={handleInputChange}>
          <option hidden value="">{appLabels.get("selectCategory")}</option>
          <option value="">{appLabels.get("all")}</option>  
          {
            productTypesOptions.map(opt => (
              <option key={opt}>{opt}</option>
            ))
          }  
      </Input>
    </div>
  );
}

export default GridCategoryFilter;
