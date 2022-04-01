'use strict';
const generateNavBar = () => {
    const navBar = `
    <header>
        <ul>
            <li><span id="main">Main</span></li> 
            <li><span id="posts">Posts</span></li>
            <li><span id="albums">Albums</span></li>
        </ul>
    </header>
  `;
  document.body.insertAdjacentHTML('afterbegin', navBar);
}

generateNavBar();