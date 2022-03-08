import React, { FC } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { confirmationModalModel, setActionAccepted, setConfirmationModal, showConfirmationModal } from '../../reducers/app.reducer';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import './ConfirmationModal.css';

interface ConfirmationModalProps {}

const ConfirmationModal: FC<ConfirmationModalProps> = () => {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector(showConfirmationModal);
  const modalModel = useAppSelector(confirmationModalModel);

  const toggle = () => {
    dispatch(setConfirmationModal());
  }

  const confirm = () => {
    dispatch(setActionAccepted());
    toggle();
  }

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggle} className="add-product-modal">
        <ModalHeader toggle={toggle}>{modalModel.title}</ModalHeader>
        <ModalBody>{modalModel.message}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={confirm}>Confirmă</Button>
          <Button color="secondary" onClick={toggle}>Anulează</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ConfirmationModal;
