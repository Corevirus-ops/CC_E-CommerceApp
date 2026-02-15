import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import './login.css';
export default function LoginMain() {
        const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [warning, setWarning] = useState("");


    useEffect(() => {
        if (user && user.user_id) {
            navigate('/');
        }
    });

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password})});
            const json = await res.json();
            if (json.ok) {
                dispatch(setUser({...json.user}));
            } else if (res.status === 401) {
                setWarning("Invalid Email Or Password!");
            }
        } catch (e) {
            console.log(e);
            setWarning("Login Failed!");
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

