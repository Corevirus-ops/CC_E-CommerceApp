import axios from "axios";
import { useSelector, useDispatch} from "react-redux";
import { setUser } from "./reducers/userSlice";
import { useNavigate } from "react-router";


export default function Home() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    function handleLogout() {
        if (!user.loggedIn) {
            return;
        }
        axios.delete(`${process.env.REACT_APP_API_URL}/logout`, {withCredentials: true}).then((res) => {
            if (res.status === 200) {
                dispatch(setUser({...res.data.user}));
                alert(res.data.message);
            }
        }).catch((e) => {
            console.log(e);
        });
    }


    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={handleLogout}>LogOut</button>
        </div>
    )
}