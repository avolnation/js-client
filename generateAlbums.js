import {
  fetchData,
  clearList
} from "./functions.js"

let span = document.getElementsByClassName("close")[0];
let allAlbums = document.querySelector("#all-albums")
let modal = document.getElementById('myModal');
let search = document.querySelector("#filterAlbums")
let bodie = document.querySelector('.modal-body')
bodie.setAttribute('style', 'display: flex; flex-wrap: wrap;width: fit-content;overflow-y: auto;height: 500px;width: 750;z-index: 1000; justify-content: center; padding-top: 10px;')

var Albums;


search.addEventListener("input", (e) => {
  let filteredArray = Albums.filter(el => el.title.includes(e.target.value));
  console.log(filteredArray)
  console.log(e.target.value)
  clearList(allAlbums)
  render(filteredArray)
})

window.addEventListener("load", async function () {
  console.log("All resources finished loading!");
  Albums = await fetchData('albums')
  render(Albums)
});


let render = async (a) => {

  if (a) {
    a.forEach(el => {

      let item = document.createElement('div')
      let title = document.createElement('p')
      let albumImg = document.createElement('img')

      item.setAttribute('id', el.id)
      item.setAttribute('class', 'album')
      albumImg.setAttribute('src', './album.svg')
      title.setAttribute('style', 'margin: 0;')

      title.innerHTML = el.title

      item.appendChild(albumImg)
      item.appendChild(title)
      allAlbums.appendChild(item)

    })
    // } else {
    //   Albums = await fetchData('Albums');
    //   render()
    // }
  }
}
window.addEventListener("click", (e) => {
  console.log(e.target.id)
  console.log(e.target.className)
  if(e.target.className == 'album' && e.target.id){
    openModal(e.target.id)
  }
})

let bodyOverflowStyle = (x) => {
  document.querySelector('body').setAttribute('style', `overflow: ${x};`)
}

let openModal = async (id) => {
  bodyOverflowStyle('hidden');
  let photos = await fetchData(`albums/${id}/photos`)

  modal.style.display = "block";

  photos.forEach(el => {
    let item = document.createElement('div')
    let title = document.createElement('p')
    let photoFromAlbum = document.createElement('img')

      item.setAttribute('id', el.id)
      item.setAttribute('class', 'album')
      photoFromAlbum.setAttribute('src', `${el.url}`)
      title.setAttribute('style', 'margin: 0;')

      title.innerHTML = el.title

      item.appendChild(photoFromAlbum)
      item.appendChild(title)
      bodie.appendChild(item)
  })

}

span.onclick = function() {
  modal.style.display = "none";
  clearList(bodie)
  bodyOverflowStyle('auto')
}
