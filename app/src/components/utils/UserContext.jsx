
import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const UserContext = createContext(); 
    const Context = ({children}) => {
        const [user, setUser] = useState(() => ({
            loggedIn: false,
        }));
        useEffect(() => {
            async function fetchUser() {
                try {
                    await axios.get(`${process.env.REACT_APP_API_URL}/account`, {credentials: 'include'}).then(res => res.json()).then(data => {
                        setUser({loggedIn: true, ...data.user});
                    });
                } catch (e) {
                    console.log(e);
                    setUser({loggedIn: false});
                }
            }
            fetchUser();
        }, []);
    
    
        return <UserContext.Provider value={user}>{children}</UserContext.Provider>
    } 

    export default Context;
