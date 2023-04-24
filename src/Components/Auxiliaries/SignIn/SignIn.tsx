import React, { FC, useContext } from "react";
import "./SignIn.css";
import { BottomContext } from "../../App/App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase-config";

const SignIn: FC = (): JSX.Element => {
    const setBottomText = useContext(BottomContext);
    return (<div className="sign-in centered">
        <button className="beaver-bg walnut-brown-border solid-border mid-border" onClick={async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                console.log(result);
                setBottomText("");
            } catch (e: any) {
                const ignoredErrors: string[] = ["auth/popup-closed-by-user", "auth/cancelled-popup-request"];
                if (ignoredErrors.includes(e.code)) return;
                setBottomText(e.message);

            }
        }}>Sign In With Google</button>
    </div>)
}

export default SignIn;