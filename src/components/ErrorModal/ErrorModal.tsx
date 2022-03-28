import { FC } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { appErrors } from '../../constants/messages.constants';
import { errorModalModel, setErrorModalModel } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';import  './ErrorModal.css';

interface ErrorModalProps {}

const ErrorModal: FC<ErrorModalProps> = () => 
{
  const dispatch = useAppDispatch();
  const modalModel = useAppSelector(errorModalModel);

  const toggle = () => {
    dispatch(setErrorModalModel({showError: false, errorMesage: appErrors.get("genericErrorMessage") as string}));
  }

  const confirm = () => {
    toggle();
  }

  return (
    <div>
      <Modal isOpen={modalModel.showError} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>Eroare</ModalHeader>
        <ModalBody>{modalModel.errorMesage}</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirm}>OK</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ErrorModal;
