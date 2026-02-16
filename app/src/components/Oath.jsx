import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle} from "@fortawesome/free-brands-svg-icons";

export default function Oath() {

    return (
        <>
            <div className="flex align-center justify-center gap-1 border-none">
                <button className="app-border btn btn-main"><FontAwesomeIcon icon={faFacebook} />acebook</button>
                <button className="app-border btn btn-main"><FontAwesomeIcon icon={faGoogle} />oogle</button>
            </div>
        <p>Or Continue With</p>
        </>
    )
}