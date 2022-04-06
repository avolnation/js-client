import {
  fetchData,
  clearList
} from "./fetchData.js"

let span = document.getElementsByClassName("close")[0];
let allAlbums = document.getElementsByClassName("all-albums")[0];
let modal = document.getElementById('myModal');
let search = document.querySelector("#filterAlbums");
let bodie = document.querySelector('.modal-body');
bodie.setAttribute('style', 'display: flex; flex-wrap: wrap; width: fit-content; z-index: 1000; justify-content: center; padding-top: 10px;');

var Albums;

//* Get information from API on page load
window.addEventListener("load", async function () {
  // console.log("All resources finished loading!");
  Albums = await fetchData('albums')
  console.log(Albums)
  console.log(!(Albums instanceof Error))
  render(Albums)
});

//* Search on album
search.addEventListener("input", (e) => {
  let filteredArray = Albums.filter(el => el.title.includes(e.target.value));
  // console.log(filteredArray)
  // console.log(e.target.value)
  clearList(allAlbums)
  render(filteredArray)
})

//* Render(re-render) passed object
let render = async (data) => {
  if (!(data instanceof Error)) {
    data.forEach(el => {
      albumItem(el.id, el.title)
    })
  }
  else{
    allAlbums.innerHTML = 'Error occured while fetching data from server. Try to reload page and check network connection.'
  }
}

let albumItem = (id, elementTitle) => {
  let item = document.createElement('div')
  let title = document.createElement('p')
  let albumImg = document.createElement('img')

  item.setAttribute('id', id)
  item.setAttribute('class', 'album')
  albumImg.setAttribute('src', './album.svg')
  // title.setAttribute('style', 'margin: 0;')

  title.innerHTML = elementTitle

  item.appendChild(albumImg)
  item.appendChild(title)
  allAlbums.appendChild(item)
}

//* Open modal on click
window.addEventListener("click", (e) => {
  // console.log(e.target.id)
  // console.log(e.target.className)
  if (e.target.className == 'album' && e.target.id) {
    openModal(e.target.id)
  }
})

//* Show/hide overflow(depends on what we passed as x param)
let bodyOverflowStyle = (x) => {
  document.querySelector('body').setAttribute('style', `overflow: ${x};`)
}

//* View photos from album
let albumPhotos = (id, url, elementTitle) => {
  let item = document.createElement('div')
  let title = document.createElement('p')
  let photoFromAlbum = document.createElement('img')

  item.setAttribute('id', id)
  item.setAttribute('class', 'album')
  photoFromAlbum.setAttribute('src', `${url}`)
  title.setAttribute('style', 'margin: 0;')

  title.innerHTML = elementTitle

  item.appendChild(photoFromAlbum)
  item.appendChild(title)
  bodie.appendChild(item)
}

//* Modal generator
let openModal = async (id) => {
  bodyOverflowStyle('hidden');
  let photos = await fetchData(`albums/${id}/photos`);

  modal.style.display = "block";

  photos.forEach(el => {
    albumPhotos(el.id, el.url, el.title);
  })

}
//* Close modal on click
span.onclick = function () {
  modal.style.display = "none";
  clearList(bodie)
  bodyOverflowStyle('auto')
}