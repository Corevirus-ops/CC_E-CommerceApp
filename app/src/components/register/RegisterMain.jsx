import { useState, useEffect } from "react";
import getURL from "../utils/getURL";
import { redirect } from "react-router";
import './register.css';
export default function RegisterMain() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [warning, setWarning] = useState("");

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
            const res = await fetch(`${getURL()}/register`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: username, email, password})});
            if (res.status === 201) {
                alert("Registration Successful!");
                window.location.href = '/';
            } else if (res.status === 302) {
                setWarning("This Email Is Already Registered!");
            } else {
                setWarning("Registration Failed!");
            }

    } catch (e) {
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
        <div className="flex align-center register-container col gap-1">
            <h1>Register</h1>
            <section className="flex align-center justify-center col gap-1 fit">
                <form className="flex col gap-1 text-center justify-space-between">
                    <label className="flex align-center justify-space-between">Username:
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label className="flex align-center justify-space-between">Email:
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label className="flex align-center justify-space-between">Password:
                        <div className="flex align-center justify-center fit">
                    <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
                        </div>
                    </label>
                    <label className="flex align-center justify-space-between">Confirm Password:
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </label>
                    <div className="flex col align-center justify-center gap-1 form-btn">
                        <button onClick={() => redirect('/login')} >Already Have An Account?</button>
                        <button type="submit" onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
            {warning && <p style={{color: 'red'}}>{warning}</p>}
            </section>
        </div>
    )
}