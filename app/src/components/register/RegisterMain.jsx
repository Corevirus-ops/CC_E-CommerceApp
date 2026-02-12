import { useState } from "react"
export default function RegisterMain() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

   async function handleSubmit(e) {
    try {
        e.preventDefault();
            if (password !== confirmPassword) {
                alert("Passwords Do Not Match!");
                return;
            }
            const res = await fetch('/register', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({name: username, email, password})});
            if (res.status === 201) {
                alert("Registration Successful!");
            } else if (res.status === 302) {
                alert("This Email Is Already Registered!");
            } else {
                alert("Registration Failed!");
            }

    } catch (e) {
        console.log(e);
    }

        }

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
                    <label>Password:
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <label>Confirm Password:
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </label>
                    <button type="submit" onClick={handleSubmit}>Submit</button>
                </form>
            </section>
        </div>
    )
}