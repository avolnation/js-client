var modal = document.getElementById('myModal');
var btn = document.getElementById("btn");
var span = document.getElementsByClassName("close")[0];

function openModal(id) {
    document.querySelector(".postBody").innerHTML = data[id-1].body
    modal.style.display = "block";
  }
  
  span.onclick = function() {
    modal.style.display = "none";

  }

  document.getElementById('MyForm').addEventListener('submit', function (e) {
    e.preventDefault()
  
    var inps = document.querySelectorAll("input, select, textarea")
    
    for (var q=0; q<inps.length; ++q) {
      if (inps[q].name && inps[q].form === this) {
        console.log("%s %s", inps[q].name, inps[q].value)
      }
    }
  })
  
  document.addEventListener('click', function(e) {
    console.log(e.target.id);
  })


async function fetchData(type) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/${type}`, {
            method: 'GET',
            credentials: 'same-origin'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

var data;

async function render(){
    typeof(data) !== 'undefined' ? render() : data = await fetchData('posts');
    console.log(data)
    data.forEach(el => {
        document.querySelector("#info").insertAdjacentHTML('afterbegin', 
            `<div class="post">
                <div class="title">${el.title}</div>
                <div id="postBody">${el.body}</div>
                </div>
                <button onclick="openModal(${el.id})" class="btn" id="${el.id}">Редактировать пост</button>
                <hr>`
                );
        });
}
