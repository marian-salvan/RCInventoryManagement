import { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FC, useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardSubtitle, CardTitle, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { emailRegex } from '../../constants/app.constants';
import { LoginModel } from '../../models/login.model';
import { firebaseApp, fireStoreDatabase, loggedUser } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { signInUserAsync } from '../../thunks/auth.thunk';
import { getLoggedInUserMetaDataAsync } from '../../thunks/users.thunk';
import './Login.css';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const dispatch = useAppDispatch();
  const app = useAppSelector(firebaseApp);
  const auth = getAuth(app as FirebaseApp);
  const user = useAppSelector(loggedUser)
  const db = useAppSelector(fireStoreDatabase);
  const navigate = useNavigate();

  useEffect(() => {
    if (user != null) {
      navigate("/products");
      const email = user.email as string;
      dispatch(getLoggedInUserMetaDataAsync({db, email}));
    }
  }, [user])

  const [loginModel, setLoginModel] = useState<LoginModel>({
    email: '',
    password: '',
    valid: null
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value as string;

    setLoginModel({
      ...loginModel,
      [name]: value
    });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email: string = loginModel.email;
    const password: string = loginModel.password;

    dispatch(signInUserAsync({auth, email, password}));
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (emailRegex.test(event.target.value)) {
      loginModel.valid = true;
    } else {
      loginModel.valid = false;
    }

    handleInputChange(event);
  }

  return (
    <div className="login">
      <Card>
        <CardBody>
          <CardTitle><h4>CRR Cluj - Management de donații</h4></CardTitle>
          <CardSubtitle><h5>Intră în cont</h5></CardSubtitle>
          <Form className="form" onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                onChange={handleEmailChange}
                type="email"
                name="email"
                invalid={loginModel.valid !== null && !loginModel.valid}
                id="exampleEmail"
                placeholder="example@example.com"
              />
              <FormFeedback>
               Emailul introdus nu este corect
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="examplePassword">Parolă</Label>
              <Input
                onChange={handleInputChange}
                type="password"
                name="password"
                id="examplePassword"
                placeholder="********"
              />
            </FormGroup>
            <Button disabled={!loginModel.valid} color="primary">Logare</Button>
          </Form>
        </CardBody>
      </Card>
  </div>
);
}

export default Login;
