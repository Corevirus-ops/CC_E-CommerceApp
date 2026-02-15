import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../reducers/userSlice";
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
            setWarning(e.response?.data?.message || "Login Failed!");
        }
    }

     useEffect(() => {
            if (email && password) {
                setWarning("");
            }
        }, [email, password]);

    return (
        <div className="flex col align-center gap-1 Login-container" onSubmit={(e) => handleSubmit(e)}>
            <h1>Login Page</h1>
            <form className="flex col align-center justify-space-between gap-1">
                <label className="flex justify-space-between gap-1">
                    Email:
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </label>
                <label className="flex justify-space-between gap-1">
                    Password:
                    <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <label className="flex justify-space-between gap-1">
                    Show Password
                    <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                </label>
                <button type="submit" >Submit</button>
                <button onClick={() => navigate('/register')}>Don't Have An Account?</button>
                {warning && <p className="warning">{warning}</p>}
            </form>
            <section className="flex col align-center justify-center gap-1 alt-login">
                <h2>Log In With</h2>
                    <div className="flex align-center justify-center gap-1">
                <button><FontAwesomeIcon icon={faFacebook} color="blue" /></button>
                <button><FontAwesomeIcon icon={faGoogle} style={{color: 'hsl(0, 90%, 62%)'}} /></button>
                    </div>
            </section>
        </div>
    )
}

