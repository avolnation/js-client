var data = [];
var commentsData;
modal = document.getElementById('myModal');
btn = document.getElementById("btn");
span = document.getElementsByClassName("close")[0];
info = document.getElementById("info-filling");
form = document.getElementById("modifyPost");
posts = document.getElementById("posts");
inf = document.getElementById("info");


addComment = (e) => {
    e.preventDefault();
    let id = localStorage.getItem('btn-id')
    let values = getValuesFromModal();
    commentsData.push({postId: id + 1, id: commentsData.length, body: values['form-body'], name: values['form-title']})
        commentsDiv = document.querySelector(`.comments-${id}`)
        console.log(id)
        console.log(commentsDiv)

        showComments(id)
        // clearList(document.querySelector(`.comments-${id}`))

        form.reset()
        modal.style.display = "none";


}

showComments = async (e) => {

    comms = document.querySelector(`.comments-${e.id}`)
    if(commentsData){
        clearList(document.querySelector(`.comments-${e.id}`))
        // console.log(commentsData)
        // console.log(e)
        // console.log(info)
        
        // console.log(e.id)
        p = document.createElement('p')
        addCommentButton = document.createElement('button')
        p.innerHTML = 'Comments:'
        
            addCommentButton.setAttribute('onclick', "openModal(this, 'add comment to')")
            addCommentButton.setAttribute('id', `${e.id}`)
            addCommentButton.innerHTML = 'Add Comment'

        comms.appendChild(p)
        
        
        commentsData.forEach(el => {
            // console.log(e.id)
            // console.log(el.postId)
            if(e.id + 1 == el.postId){
            div = document.createElement('div')
            commentName = document.createElement('p')
            commentBody = document.createElement('p')


            div.setAttribute('class', 'comment')
            commentName.innerHTML = el.name
            commentName.setAttribute('style', 'font-weight: bold;')
            commentBody.innerHTML = el.body

            div.appendChild(commentName)
            div.appendChild(commentBody)


            comms.appendChild(div)}})
            comms.appendChild(addCommentButton)
    }        
    else{
        comms.innerHTML = 'Waiting for server response'
        commentsData = await fetchData('comments');
        comms.innerHTML = ''
        showComments(e)
    }
    
    
}

    

form.addEventListener('submit', (e) => {
    let lsAction = localStorage.getItem('action');
    if(lsAction == 'add'){addPost(e)}
    if(lsAction == 'modify'){modifyPost(e)}
    if(lsAction == 'add comment to'){addComment(e)}
});

posts.addEventListener('click', () => {
    addPostBtn(); 
})

//Deleting all child elements before we re-render them 
function clearList(elToClear) {
    while (elToClear.firstChild) {
        elToClear.removeChild(elToClear.firstChild);
    }
}

openModal = (el, action) => {
    // console.log(el.id)
    localStorage.setItem('action', action)
    document.querySelector("#action").innerHTML = `You're about to ${action} post`
    localStorage.setItem('btn-id', el.id)
    if(action == 'modify'){
        // console.log(data[el])
        localStorage.setItem('btn-id', el.id)
        document.querySelector(".postTitle").innerHTML = data[el.id].title
        document.querySelector(".postBody").innerHTML = data[el.id].body
    }
    
    modal.style.display = "block";
  }
  
getValuesFromModal = () => {
    const fields = document.querySelectorAll('input')
    const values = {};
    fields.forEach(field => {
        const {name, value} = field;
        values[name] = value; 
    })
    return values;
}

addPost = (e) => {
    e.preventDefault();
    const values = getValuesFromModal();
    data.push({id: data.length + 1, body: values['form-body'], title: values['form-title']})
    
        clearList(info)
    
        render()
    
        form.reset()
        modal.style.display = "none";
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
    
        clearList(info)
    
        render()
    
        form.reset()
        resetPosts();
        modal.style.display = "none";
    
}
resetPosts = () => {
    document.querySelector(".postTitle").innerHTML = ''
    document.querySelector(".postBody").innerHTML = ''
}

span.onclick = function() {
    modal.style.display = "none";
    resetPosts();

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

addPostBtn = () => {
    // clearList(inf)

    addTaskBtn = document.createElement('button')
    addTaskBtn.innerHTML = 'Add Post'
    addTaskBtn.onclick = () => openModal( 0 , 'add')
    fetchPostsBtn = document.createElement('button')
    fetchPostsBtn.innerHTML = 'Fetch posts'
    fetchPostsBtn.onclick = async () => {
        let dataFromFetch =  await fetchData('posts');
        data = [...data, ...dataFromFetch];
        render()
    }

    input = document.createElement('input')
    input.innerHTML = 'Search for posts'
    input.setAttribute('id', 'search')
    input.setAttribute('type', 'text')

    inf.insertBefore(addTaskBtn,info)
    inf.insertBefore(fetchPostsBtn,info)
    inf.insertBefore(input,info)

    search = document.getElementById("search");

    search.addEventListener("change", (e) => {
        data = data.filter(el => el.title.includes(e.target.value))
        render()
    })

}

async function render(){
    clearList(info)
    
    // console.log(data)

    if(data){
        data.forEach((el, index) => {

            if(el.body && el.title){
            item = document.createElement('div')
            title = document.createElement('p')
            body = document.createElement('p')
            modifyButton = document.createElement('button')
            showCommentsButton = document.createElement('button')
            comments = document.createElement('div')

                item.setAttribute('class', 'post')
                title.setAttribute('class', 'postTitle')
                body.setAttribute('class', 'postBody')
                modifyButton.setAttribute('onclick', "openModal(this, 'modify')")
                showCommentsButton.setAttribute('onclick', "showComments(this)")
                comments.setAttribute('class', `comments-${index}`)
            
            
    
            modifyButton.id = index
            showCommentsButton.id = index

                title.innerHTML = el.title
                body.innerHTML = el.body
                modifyButton.innerHTML = 'Modify Post'
                showCommentsButton.innerHTML = 'Show comments'
            
    
            
            item.appendChild(title)
            item.appendChild(body)
            item.appendChild(modifyButton)
            item.appendChild(showCommentsButton)
            item.appendChild(comments)
            info.appendChild(item)

                // item.setAttribute("style", "border: 2px solid; border-color: black; border-radius: 5px;")
            }
            
    })
    }
    else{
        data = await fetchData('posts');
        render()
}

}
