import { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseApp, setLoggedUser } from '../../reducers/app.reducer';
import { signInWithGoogle } from '../../services/auth.service';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import styles from './Login.module.css';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const dispatch = useAppDispatch();
  const app = useAppSelector(firebaseApp);
  const navigate = useNavigate();

  const auth = getAuth(app as FirebaseApp);

  useEffect(() => { 
    const signIn = async () => {
      try {
        const result = await signInWithGoogle(auth);
        dispatch(setLoggedUser(result));
        navigate('/products');
      } catch (error) {
        console.log("could not log in"); 
      }
    }

    signIn();
  });

  return (
    <div className={styles.Login}>
      Login Component
    </div>
  );
}

export default Login;
