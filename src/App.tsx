import './App.css';
import { FirebaseApp, initializeApp } from "firebase/app";
import { getFirestore, Firestore } from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { loggedUser, setFirebaseApp, setFirebaseDb, setLoggedInUser, showLoader } from './reducers/app.reducer';
import { firebaseConfig } from './firebase.config';
import { BrowserRouter  } from 'react-router-dom';
import SideBar from './components/Sidebar/SideBar';
import Content from './components/Content/Content';
import Loader from './components/Loader/Loader';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const dispatch = useAppDispatch();
  const app: FirebaseApp = initializeApp(firebaseConfig);
  const database: Firestore = getFirestore();
  const user = useAppSelector(loggedUser);
  const loader = useAppSelector(showLoader);
  const auth = getAuth();

  dispatch(setFirebaseApp(app));
  dispatch(setFirebaseDb(database));

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setLoggedInUser(user));
    } else {
      dispatch(setLoggedInUser(null));
    }
  });
  
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
