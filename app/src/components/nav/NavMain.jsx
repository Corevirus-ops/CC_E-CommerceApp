
import {Link, NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar';
import './nav.css';

export default function NavMain() {

function checkAct() {
    return ({isActive}) => isActive ? 'app-border' : '';
}
    return (
        <nav className='nav main-nav flex row justify-space-evenly wrap width-fit align-center app-border'>
            <h3><Link className='flex row' to={'/'}><FontAwesomeIcon icon={faShop} /> Eccomerce</Link></h3>
            <div className='flex stretch align-center wrap'>
                <NavLink to={'/products'} className={checkAct()}>Products</NavLink>
                <NavLink to={'/product/electronics'} className={checkAct()}>Electronics</NavLink>
                <NavLink to={'/product/accessories'} className={checkAct()}>Accessories</NavLink>
                <NavLink to={'/product/footwear'} className={checkAct()}>Footwear</NavLink>
            </div>
            <div className='flex stretch align-center justify-space-evenly wrap'>
                <SearchBar />
                <NavLink to={'/login'}><FontAwesomeIcon icon={faUserGroup} /></NavLink>
            </div>
        </nav>
    )
}