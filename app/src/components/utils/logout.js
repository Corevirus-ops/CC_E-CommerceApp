import axios from 'axios';

export default async function logout(dispatch, user, setUser) {
try {
        if (!user.loggedIn) {
            return;
        }
        axios.delete(`${process.env.REACT_APP_API_URL}/logout`, {withCredentials: true}).then((res) => {
            if (res.status === 200) {
                dispatch(setUser({...res.data.user}));
                alert(res.data.message);
            }
        });
} catch (e) {
    console.error(e);
}
}