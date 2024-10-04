import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function Menu() {
  return (
    <Fragment>
      <h1>SSR Editor</h1>
      <nav>
        <ul>
          <li><Link to={'/'}>Home </Link></li>
          <li><Link to={'/about'}>About</Link></li>
          <li><Link to={'/contact'}>Contact</Link></li>
        </ul>
      </nav>
    </Fragment>
  );
}

export default Menu;