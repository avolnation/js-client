var modal = document.getElementById('myModal');
var btn = document.getElementById("btn");
var span = document.getElementsByClassName("close")[0];
info = document.getElementById("info");
form = document.getElementById("modifyPost")

form.addEventListener('submit', modifyPost)


function clearList() {
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }
}

async function openModal(el, action) {
    
    document.querySelector("#action").innerHTML = `You're about to ${action} post`
    if(el){
        localStorage.setItem('btn-id', el.id-1)
        document.querySelector(".postTitle").innerHTML = data[el.id-1].title
        document.querySelector(".postBody").innerHTML = data[el.id-1].body
    }
    
    modal.style.display = "block";
  }
  

addPost = () => {
    openModal('','add')
}
function modifyPost(e){
    e.preventDefault();

    const fields = document.querySelectorAll('input')
    const values = {};
    fields.forEach(field => {
        const {name, value} = field;
        values[name] = value; 
    })

    let id = localStorage.getItem('btn-id')

    data[id].body = values['form-body']
    data[id].title = values['form-title']

    clearList()

    render()

    form.reset()
    modal.style.display = "none";
    
    console.log(data[id])
    

}
  
  span.onclick = function() {
    modal.style.display = "none";

  }
  
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
    clearList()
    addbtn = document.createElement('button')
    addbtn.innerHTML = 'Add Post'

    info.appendChild(addbtn)

    if(data){
        data.forEach(el => {
            item = document.createElement('div')
            title = document.createElement('p')
            body = document.createElement('p')
            modifyButton = document.createElement('button')
    
            item.setAttribute('class', 'post')
    
            title.setAttribute('class', 'postTitle')
            body.setAttribute('class', 'postBody')
            modifyButton.setAttribute('onclick', "openModal(this, 'modify')")
            
    
            modifyButton.id = el.id
            title.innerHTML = el.title
            body.innerHTML = el.body
            modifyButton.innerHTML = 'Modify Post'
    
    
            item.appendChild(title)
            item.appendChild(body)
            item.appendChild(modifyButton)
            info.appendChild(item)
    })
    }
    else{
        data = await fetchData('posts');
        render()
}

}
