'use strict';
const generateNavBar = () => {
    const navBar = `
    <header>
        <ul>
            <li><span id="posts">Posts<span></li>
            <li><span>Albums<span></li>
            <li><span>Photos<span></li>
        </ul>
    </header>
  `;
  document.body.insertAdjacentHTML('afterbegin', navBar);
}

generateNavBar();