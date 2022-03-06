import React, { useState } from 'react';
import './App.css';
import { FirebaseApp, initializeApp } from "firebase/app";
import { useAppDispatch } from './stores/hooks';
import { setFirebaseApp } from './reducers/app.reducer';
import { firebaseConfig } from './firebase.config';
import { BrowserRouter  } from 'react-router-dom';
import SideBar from './components/Sidebar/SideBar';
import Content from './components/Content/Content';

const App = () => {
  const dispatch = useAppDispatch();
  const app: FirebaseApp = initializeApp(firebaseConfig);

  dispatch(setFirebaseApp(app));
  
  return (
    <BrowserRouter>
      <div className="App wrapper">
        <SideBar />
        <Content />
      </div>
    </BrowserRouter>
  );
}

export default App;
