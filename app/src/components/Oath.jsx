import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle} from "@fortawesome/free-brands-svg-icons";

export default function Oath() {

    function handleFacebookLogin() {
window.location.href = `${process.env.REACT_APP_API_URL}/login/facebook`;
    }

    return (
        <>
            <div className="flex align-center justify-center gap-1 border-none">
                <button className="app-border btn btn-main" onClick={handleFacebookLogin}><FontAwesomeIcon icon={faFacebook} />acebook</button>
                <button className="app-border btn btn-main"><FontAwesomeIcon icon={faGoogle} />oogle</button>
            </div>
        <p>Or Continue With</p>
        </>
    )
}