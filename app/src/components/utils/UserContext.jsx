
import { createContext, useEffect } from "react";
import {setUser} from "../reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
export const UserContext = createContext(); 
    const Context = ({children}) => {
const dispatch = useDispatch();
const user = useSelector((state) => state.user.user);

        useEffect(() => {
            async function fetchUser() {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/account`, {withCredentials: true});
                    dispatch(setUser({loggedIn: true, ...res.data.user}));
                } catch (e) {
                    console.log(e);
                    dispatch(setUser({loggedIn: false}));
                }
            }
            fetchUser();
        }, []);
    
    
        return <UserContext.Provider value={user}>{children}</UserContext.Provider>
    } 

    export default Context;
