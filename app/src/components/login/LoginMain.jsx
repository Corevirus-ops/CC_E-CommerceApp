import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../reducers/userSlice";
import Oath from "../Oath";
import './login.css';
export default function LoginMain() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [warning, setWarning] = useState("");
const user = useSelector((state) => state.user.user);

    useEffect(() => {
if (user.loggedIn) {
    navigate('/');
}
    });

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {email, password}, {headers: {'Content-Type': 'application/json'}, withCredentials: true});
            if (res.status === 200) {
                setWarning(res.data.message);
                dispatch(setUser({loggedIn: true, ...res.data.user}));
            }
        } catch (e) {
            console.log(e);
            setWarning(e.data?.message || "Login Failed!");
        }
    }

     useEffect(() => {
            if (email && password) {
                setWarning("");
            }
        }, [email, password]);

    return (
        <div className="flex col align-center justify-center gap-1 Login-container" >
            <section className="flex col justify-center gap-1 wrap">
            <h3>Welcome Back</h3>
            <p>Enter Your Credentials To Access Your Account</p>
            <Oath />
            <form className="flex col align-center justify-center gap-1" onSubmit={(e) => handleSubmit(e)}>
                <label className="flex col justify-space-between gap-1 fit">
                    <span>Email:</span>
                    <div className="flex row gap-1 fit relative app-border main-input">
                        <input type="email" spellCheck="false" name="email" value={email} onChange={(e) => e.target.value.length <= 50 && setEmail(e.target.value)} required placeholder="✉ D0t@example.com" />
                   </div>     
                </label>
                <label className="flex col justify-space-between gap-1 fit">
                    <span>Password:</span>
                    <div className="flex row justify-space-between gap-1 fit relative app-border main-input">
                        <input type={showPassword ? "text" : "password"} spellCheck="false" name="password" value={password} onChange={(e) => e.target.value.length <= 30 && setPassword(e.target.value)} required placeholder="⚙ *****" />
                        <button id="toggleShow" type="button" onClick={() => setShowPassword(!showPassword)}><FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /></button>
                    </div>
                </label>
                <button className="app-border btn btn-contrast" onClick={() => navigate('/register')}>No Account? Sign Up Here</button>
                <button className="app-border btn btn-main" type="submit" >Submit</button>
                {warning && <p className="warning">{warning}</p>}
            </form>
            </section>
        </div>
    )
}

