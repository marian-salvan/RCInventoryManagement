export interface ConfirmationModalModel {
    title: string;
    message: string;
    buttonColor: string;
}

export interface AddRemoveModalModel {
  modalTitle: string;
  buttonText: string;
  buttonClass: string;
  addQty: boolean;
}

export interface ErrorModalModel {
  showError: boolean;
  errorMesage: string;
}