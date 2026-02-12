import { useState, useEffect } from "react";
import getURL from "../utils/getURL";
import { redirect } from "react-router";
export default function RegisterMain() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
                 window.location.href = '/';
                alert("Registration Successful!");
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
        <div>
            <h1>Register</h1>
            <section>
                <form>
                    <label>Username:
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label>Email:
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    {warning && <p style={{color: 'red'}}>{warning}</p>}
                    <label>Password:
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <label>Confirm Password:
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </label>
                    <button onClick={() => redirect('/login')} >Already Have An Account?</button>
                    <button type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </section>
        </div>
    )
}