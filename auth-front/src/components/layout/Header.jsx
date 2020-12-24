import React, {useState} from 'react'
import "./layout.scss"
import {Link} from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';
import Button from "@material-ui/core/Button"

function Header() {
    const [sidebar, setSidebar] = useState(false);
  const navToggler = () => setSidebar(!sidebar);

  return (
    <div className="header">
      <h1 className=" logo">Firefly</h1>
      <ul onClick={navToggler} className={`${sidebar ? "active" : ""}`}>
        <li>Home</li>
        <li>About</li>
        <li><Link to="/login"><Button color='primary' variant='contained'>Login</Button></Link></li>
        <li><Link to="/register"><Button variant='contained'>Register</Button></Link></li>
      </ul>
      <MenuIcon className="bar" onClick={navToggler} />
    </div>
  );
}

export default Header
