import React, { useState } from "react";
import "./Modal.css";

interface ModalProps extends React.PropsWithChildren {
    classNames?: string,
    visibiltyHandler: Function
}
function Modal(props: ModalProps) {
    return (
        <div className={"modal " + props.classNames ?? ""}>
            {props.children}
        </div>
    )
}

export default Modal;