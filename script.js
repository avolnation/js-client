var modal = document.getElementById('myModal');
var btn = document.getElementById("btn");
var span = document.getElementsByClassName("close")[0];
info = document.getElementById("info");
form = document.getElementById("modifyPost")

form.addEventListener('submit', (e) => modifyPost(e))


//Deleting all child elements before we re-render them 
function clearList() {
    while (info.firstChild) {
        info.removeChild(info.firstChild);
    }
}

openModal = (el, action) => {
    
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

modifyPost = (e) => {

    e.preventDefault();

    const fields = document.querySelectorAll('input')
    const values = {};
    fields.forEach(field => {
        const {name, value} = field;
        values[name] = value; 
    })

    let id = localStorage.getItem('btn-id')

    console.log(e)

    
        data[id].body = values['form-body']
        data[id].title = values['form-title']
    
        clearList()
    
        render()
    
        form.reset()
        modal.style.display = "none";
    
}
  
  span.onclick = function() {
    modal.style.display = "none";
    document.querySelector(".postTitle").innerHTML = ''
    document.querySelector(".postBody").innerHTML = ''

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
        console.log(data)
        return data;
    } catch (error) {
        console.error(error);
    }
}

var data;

async function render(){
    clearList()
    addTaskBtn = document.createElement('button')
    addTaskBtn.innerHTML = 'Add Post'
    addTaskBtn.onclick = () => openModal( 0 , 'add')
    info.appendChild(addTaskBtn)


    if(data){
        data.forEach(el => {
            if(el.body && el.title){
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
            }
            
    })
    }
    else{
        data = await fetchData('posts');
        render()
}

}
