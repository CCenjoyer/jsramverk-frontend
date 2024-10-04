import React, { Fragment } from "react";
import { Link } from "react-router-dom";

// span tabs for whitespace &nbsp won't work.

function Menu() {
  return (
    <Fragment>
      <Link to={`/`}>Home</Link> | <span></span>
      <Link to={`/about`}>About</Link> | <span></span>
      <Link to={`/contact`}>Contact</Link>
      <hr />
    </Fragment>
  );
}

export default Menu;
