import React, { FC } from 'react';
import { Input } from 'reactstrap';
import { setGridSearchText } from '../../reducers/app.reducer';
import { useAppDispatch } from '../../stores/hooks';
import './GridSearch.css';

interface GridSearchProps {}

const GridSearch: FC<GridSearchProps> = () => {
  const _ = require('lodash');
  const dispatch = useAppDispatch();

  const delayedCallback = _.debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setGridSearchText(event.target.value.toLowerCase()));
  }, 500);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    delayedCallback(event);
  }

  return (
    <div className="grid-search-container">
      <Input onChange={handleSearchChange} 
             className="search-input" 
             type="search" 
             name="search" 
             id="search"
             placeholder="Caută după nume"/>   
    </div>
  );  

}
export default GridSearch;
