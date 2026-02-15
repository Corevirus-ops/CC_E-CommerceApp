import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { UserContext } from "../utils/UserContext";
import './register.css';
export default function RegisterMain() {

    const user = useContext(UserContext);

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [warning, setWarning] = useState("");

    useEffect(() => {
        // if (user && user.user_id) {
        //     navigate('/');
        // }
        console.log(user);
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
           const res = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {name: username, email, password}, {headers: {'Content-Type': 'application/json'}});
              if (res.status === 201) {
                setWarning(res.data.message);
                } 
           

    } catch (e) {
        if (e.response && e.response.status === 409) {
                    setWarning("This Email Is Already Registered!");
                } else {
                    setWarning(e.response?.data?.message || "Registration Failed!");
                }
        console.log(e);
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
            <h1>Register</h1>
            <section className="flex align-center justify-center col gap-1 fit">
                <form className="flex col gap-1 text-center justify-space-between">
                    <label className="flex align-center justify-space-between">Username:
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label className="flex align-center justify-space-between">Email:
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </label>
                    <label className="flex align-center justify-space-between">Password:
                        <div className="flex align-center justify-center fit">
                    <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
                        </div>
                    </label>
                    <label className="flex align-center justify-space-between">Confirm Password:
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </label>
                    <div className="flex col align-center justify-center gap-1 form-btn">
                        <button onClick={() => navigate('/login')} >Already Have An Account?</button>
                        <button type="submit" >Submit</button>
                    </div>
                </form>
            {warning && <p style={{color: 'red'}}>{warning}</p>}
            </section>
        </div>
    )
}