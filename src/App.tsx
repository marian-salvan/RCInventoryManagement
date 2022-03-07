import './App.css';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, Firestore } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { loggedUser, setFirebaseApp, setFirebaseDb, showLoader } from './reducers/app.reducer';
import { firebaseConfig } from './firebase.config';
import { BrowserRouter  } from 'react-router-dom';
import SideBar from './components/Sidebar/SideBar';
import Content from './components/Content/Content';
import Loader from './components/Loader/Loader';

const App = () => {
  const dispatch = useAppDispatch();
  const app: FirebaseApp = initializeApp(firebaseConfig);
  const database: Firestore = getFirestore();
  const user = useAppSelector(loggedUser);
  const loader = useAppSelector(showLoader);

  dispatch(setFirebaseApp(app));
  dispatch(setFirebaseDb(database));
  
  return (
    <BrowserRouter>
      <div className="App wrapper">
        { user !== null && <SideBar />}
        <Content />
      </div>
      { loader && <Loader /> }
    </BrowserRouter>
  );
}

export default App;
