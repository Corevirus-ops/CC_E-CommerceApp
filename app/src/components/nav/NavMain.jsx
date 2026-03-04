
import {Link, NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import './nav.css';

export default function NavMain() {

    return (
        <nav className='nav main-nav flex row justify-space-evenly width-fit align-center app-border'>
            <Link className='flex row' to={'/'}><FontAwesomeIcon icon={faShop} /> Eccomerce</Link>
            <div className='flex stretch width-fit align-center'>
                <NavLink to={'/products'}>Products</NavLink>
                <NavLink to={'/products/electronics'}>Electronics</NavLink>
                <NavLink to={'/products/accessories'}>Accessories</NavLink>
                <NavLink to={'/products/footwear'}>Footwear</NavLink>
            </div>
            <div className='flex stretch align-center'>
                <NavLink to={'/login'}><FontAwesomeIcon icon={faUserGroup} /></NavLink>
            </div>
        </nav>
    )
}