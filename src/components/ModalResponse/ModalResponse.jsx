import { Modal, ModalBody, ModalHeader } from "reactstrap";

export function ModalResponseSucesso({ isOpen, toggle, backgroundColor, title, text1, text2 }) {
    return(
        <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader className={`${backgroundColor} text-white border-dark border-2`} toggle={toggle}>
          {title}
        </ModalHeader>
        <ModalBody className={`${backgroundColor} text-white`}>
          {text1}
          <br />
          <br />
          {text2}
          </ModalBody>
      </Modal>
    )
}

export function ModalResponseFalha({ isOpen, toggle, backgroundColor, title, text1, text2 }) {
  return(
      <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader className={`${backgroundColor} text-white border-dark border-2`} toggle={toggle}>
        {title}
      </ModalHeader>
      <ModalBody className={`${backgroundColor} text-white`}>
        {text1}
        <br />
        <br />
        {text2}
        </ModalBody>
    </Modal>
  )
}