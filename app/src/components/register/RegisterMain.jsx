import { useState, useEffect} from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../reducers/userSlice";
import Oath from "../Oath";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import './register.css';
export default function RegisterMain() {

    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
         if (user && user.user_id) {
             navigate('/');
         }
    });

   async function handleSubmit(e) {
    try {
        e.preventDefault();
            if (password !== confirmPassword) {
                setWarning("Passwords Do Not Match!");
                return;
            } 
            if (password.length < 8) {
                setWarning("Password Must Be At Least 8 Characters Long!");
                return;
            }
           const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {name: username, email, password}, {headers: {'Content-Type': 'application/json'}, withCredentials: true});
              if (res.status === 201) {
                setWarning(res.data.message);
                dispatch(setUser({loggedIn: true, ...res.data.user}));
                } 
           

    } catch (e) {
        if (e.response && e.response.status === 409) {
                    setWarning("This Email Is Already Registered!");
                } else {
                    setWarning(e.response?.data?.message || "Registration Failed!");
                }
        console.error(e);
    }

        }

        useEffect(() => {
            if (password && confirmPassword && password !== confirmPassword) {
                setWarning("Passwords Do Not Match!");
            } else if (password.length < 8) {
                setWarning("Password Must Be At Least 8 Characters Long!");
            } else {
                setWarning("");
            }
        }, [password, confirmPassword]);

    return (
        <div className="flex align-center register-container col gap-1" onSubmit={(e) => handleSubmit(e)}>
            <section className="flex col gap-1 fit wrap">
            <h3>Create Account</h3>
            <p>Sign Up For New Account To Gain Access</p>
            <Oath />
                <form className="flex col gap-1 text-center justify-space-between">
                    <label className="flex col align-center justify-space-between">
                        <span>Username:</span>
                        <div className="flex row gap-1 fit justify-center align-center relative app-border main-input">
                    <input type="text" spellCheck="false" name="username" value={username} onChange={(e) => e.target.value.length < 40 && setUsername(e.target.value)} required placeholder="My Name Here" />
                        </div>
                    </label>
                    <label className="flex col align-center justify-space-between">
                        <span>Email:</span>
                        <div className="flex row gap-1 fit relative justify-center align-center app-border main-input">
                    <input type="email" spellCheck="false" name="email" value={email} onChange={(e) => e.target.value.length < 50 && setEmail(e.target.value)} required placeholder="✉ D0t@example.com"/>
                    </div>
                    </label>
                    <label className="flex col align-center justify-space-between">
                        <span>Password:</span>
                        <div className="flex fit justify-center align-center relative app-border main-input">
                    <input type={showPassword ? "text" : "password"} spellCheck="false" name="password" value={password} onChange={(e) => e.target.value.length < 30 && setPassword(e.target.value)} required placeholder="At Least 8 Characters Long"/>
                    <button id="toggleShow" type="button" onClick={() => setShowPassword(!showPassword)}><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /></button>
                        </div>
                    </label>
                    <label className="flex col align-center justify-space-between">
                        <span>Confirm Password:</span>
                        <div className="flex fit justify-center align-center relative app-border main-input">
                    <input type="password" spellCheck="false" name="confirmPassword" value={confirmPassword} onChange={(e) => e.target.value.length < 30 && setConfirmPassword(e.target.value)}  required placeholder="Confirm Password" />
                    </div>
                    </label>
                    <div className="flex col align-center justify-center gap-1">
                        <button className="app-border btn btn-contrast" onClick={() => navigate('/login')} >Already Have An Account?</button>
                        <button className="app-border btn btn-main" type="submit" >Submit</button>
                    </div>  
                </form>
                <div className="flex fit gap-1 align-center justify-center">
            {warning && password.length > 0 && <p className="fit" style={{color: 'red'}}>{warning}</p>}
                </div>
            </section>
        </div>
    )
}