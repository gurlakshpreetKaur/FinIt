import React, { useEffect, useState, useContext, useRef } from "react";
import "./Modal.css";
import { BottomContext } from "../../App/App";

interface ModalProps extends React.PropsWithChildren {
    classNames?: string,
    visibiltyHandler: Function
}
function Modal(props: ModalProps) {
    const setBottomText = useContext(BottomContext);
    const elementRef = useRef(null);
    useEffect(() => {
        return (() => {
            setBottomText("");
        });
    }, []);
    window.addEventListener("click", (click) => {
        if (elementRef.current === null) return;
        if (click.target !== elementRef.current && !(elementRef.current as Element).contains(click.target as Node)) {
            props.visibiltyHandler(false);
        }
        console.log(click.target, !((click.target as Element).classList.contains("modal")));
    }, true);
    return (
        <div className={"modal " + props.classNames ?? ""} ref={elementRef}>
            {props.children}
        </div>
    )
}

export default Modal;