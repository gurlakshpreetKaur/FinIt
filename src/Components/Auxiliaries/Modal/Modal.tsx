import React, { useEffect, useState, useContext, useRef } from "react";
import "./Modal.css";
import { BottomContext } from "../../App/App";

interface ModalProps extends React.PropsWithChildren {
    isVisible: boolean,
    isExistant?: boolean,
    classNames?: string,
    visibiltyHandler: Function
    existenceHandler: Function
}
function Modal(props: ModalProps) {
    const setBottomText = useContext(BottomContext);
    const elementRef = useRef(null);
    const [classList, setClassList] = useState(!props.isVisible ? "fade-out" : "");
    // const [elementToDisplay, setElementToDisplay] = useState(modalEl);
    useEffect(() => {
        return (() => {
            setBottomText("");
        });
    }, []);

    useEffect(() => {
        if (!props.isVisible) {
            setClassList("fade-out");
            setTimeout(() => {
                props.existenceHandler(false);
            }, 1000);
        }
        else setClassList("");
    }, [props.isVisible]);

    window.addEventListener("click", (click) => {
        if (elementRef.current === null) return;
        if (click.target !== elementRef.current && !(elementRef.current as Element).contains(click.target as Node)) {
            props.visibiltyHandler(false);
        }
    }, true);
    return <div className={"modal solid-border mid-border pretty-green-border " + (props.classNames || "") + " " + classList} ref={elementRef}>
        <button className="cross-btn" onClick={() => {
            props.visibiltyHandler(false);
            setTimeout(() => {
                props.existenceHandler(false)
            }, 1000);
        }}>x</button>
        {props.children}
    </div>;;
}

export default Modal;