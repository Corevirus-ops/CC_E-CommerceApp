import { useSelector, useDispatch} from "react-redux";
import { setUser } from "./reducers/userSlice";
import { useNavigate } from "react-router";
import logout from './utils/logout';


export default function Home() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    function handleLogout() {
        logout(dispatch, user, setUser);
    }


    return (
        <div>
            <h1>Home</h1>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={handleLogout}>LogOut</button>
        </div>
    )
}