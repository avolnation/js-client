import {
    fetchData,
    clearList
} from "./fetchData.js"

import {
    openModal
} from "./modal.js"

let uid = () => {
    return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
  };

var data = [];
var commentsData = new Map(); //* Dictionary of comments
var postsFetched;

let modal = document.getElementById('myModal');
let span = document.getElementsByClassName("close")[0];
let info = document.getElementsByClassName("info-filling")[0];
let form = document.getElementById("modifyPost");
let inf = document.getElementsByClassName("info")[0];

//* Add nav bar on page load
window.addEventListener("load", async function () {
    // console.log("All resources finished loading!");
    addNavButtons();
});

//* Listeners for modal
form.addEventListener('submit', (e) => {
    let lsAction = localStorage.getItem('action');
    if (lsAction == 'add') {
        addOrModifyPost(e, 'add')
    }
    if (lsAction == 'modify') {
        addOrModifyPost(e, 'modify')
    }
    if (lsAction == 'add comment to') {
        addComment(e)
    }
});

//* Add comment to post
let addComment = (e) => {
    e.preventDefault();
    let id = localStorage.getItem('btn-id')
    console.log(id)
    
    let values = getValuesFromModal();
    if (commentsData.has(id)) {
        let commsData = commentsData.get(id)
        commsData.push({
            postId: id,
            id: commentsData.length ? commentsData.get(id).length + 1 : commentsData.get(id),
            body: values['form-body'],
            name: values['form-title']
        })
        // console.log(commsData)
        commentsData.set(id, commsData)
        // console.log(commentsData.get(commsId))
    } else {
        commentsData.set(id, [{
            postId: id,
            id: commentsData.length,
            body: values['form-body'],
            name: values['form-title']
        }])
    }
    let commentsDiv = document.querySelector(`div#comments-${id}`)

    clearList(commentsDiv)
    renderComments(id)

    resetModal();
}

//* Comments render
let renderComments = (id) => {
    let comms = document.querySelector(`div#comments-${id}`)
    let addCommentButton = document.createElement('button')
    let p = document.createElement('p')
    p.innerHTML = 'Comments:'

    comms.appendChild(p)

    addCommentButton.addEventListener('click', (e) => openModal(e, 'add comment to'))
    addCommentButton.setAttribute('id', `${id}`)
    addCommentButton.innerHTML = 'Add Comment'
    console.log(commentsData)
    if(commentsData.size != 0){
        commentsData.get(id).forEach(el => {

            let div = document.createElement('div')
            let commentName = document.createElement('p')
            let commentBody = document.createElement('p')
    
    
            div.setAttribute('class', 'comment')
            commentName.innerHTML = el.name
            commentName.setAttribute('style', 'font-weight: bold;')
            commentBody.innerHTML = el.body
    
            div.appendChild(commentName)
            div.appendChild(commentBody)
    
            comms.appendChild(div)
    
        })
    }

    comms.appendChild(addCommentButton)
}

//* Show comments
let showComments = async (e) => {

    let eId = e.target.id;
    // console.log(eId)

    let id = eId.match(/-(.+)/)[1]
    // console.log(id)

    let comms = document.querySelector(`div#comments-${id}`)
    clearList(comms)
    // console.log(comms)

    // console.log(commentsData.has(id))
    if (commentsData.has(id)) {
        clearList(comms)
        renderComments(id)
    } else {
        clearList(comms)

        comms.innerHTML = 'Waiting for server response'

        let commentsForParticularPost = await fetchData(`comments?postId=${id}`);

        if (commentsForParticularPost.message) {
            alert(commentsForParticularPost.message);
        }

        if (!(commentsForParticularPost instanceof Error) ) {
            let restData = commentsData.get(id);
            // console.log(!!restData)
            if (restData) {
                commentsData.set(id, [...restData, ...commentsForParticularPost])
            } else {
                commentsData.set(id, [...commentsForParticularPost])
                // console.log(commentsData.get(id))
            }
        }
    }
    clearList(comms)
    renderComments(id)
}

//* Get params from modal
let getValuesFromModal = () => {
    const fields = document.querySelectorAll('input')
    const values = {};
    fields.forEach(field => {
        const {
            name,
            value
        } = field;
        values[name] = value;
    })
    return values;
}

//* Add or modify posts
let addOrModifyPost = (e, action) => {
    e.preventDefault();

    let id = localStorage.getItem('btn-id');

    const values = getValuesFromModal();

    if (action == 'add') {
        data.push({
            id: uid(),
            body: values['form-body'],
            title: values['form-title']
        })
    }

    if (action == 'modify') {
        data.forEach(el => {
            if (el.id == id) {
                el.body = values['form-body']
                el.title = values['form-title']
            }
        })
    }

    resetModal();
    clearList(info)
    render(data);

}

//* Reset modal(hide it and reset all inputs/datas)
let resetModal = () => {
    modal.style.display = "none";
    form.reset();
    document.querySelector(".post-title").innerHTML = ''
    document.querySelector(".post-body").innerHTML = ''
}

//* Reset modal on button (X) click
span.onclick = () => {
    resetModal()
}


//* For test purposes
// document.addEventListener('click', function (e) {
//     console.log(e);
// })

//* Add nav buttons
let addNavButtons = () => {

    let addTaskBtn = document.createElement('button')
    addTaskBtn.innerHTML = 'Add post'
    addTaskBtn.setAttribute('class', 'nav-button')
    addTaskBtn.onclick = () => openModal(0, 'add')

    let fetchPostsBtn = document.createElement('button')
    fetchPostsBtn.setAttribute('class', 'nav-button')
    fetchPostsBtn.innerHTML = 'Fetch posts'
    fetchPostsBtn.onclick = async () => {
        let dataFromFetch = await fetchData('posts');
        // console.log(postsFetched)

        if (postsFetched == undefined) {
            data = [...data, ...dataFromFetch];
            postsFetched = 1;
        }

        render(data)
    }

    let input = document.createElement('input')
    input.innerHTML = 'Search for posts'
    input.setAttribute('id', 'search')
    input.setAttribute('type', 'text')
    input.setAttribute('class', 'form-input')
    input.setAttribute('placeholder', 'Search')

    inf.appendChild(fetchPostsBtn, info)
    inf.appendChild(addTaskBtn, info)
    inf.appendChild(input, info)

    let search = document.getElementById("search");

    search.addEventListener("input", (e) => {
        let filteredData = data.filter(el => el.title.includes(e.target.value))
        render(filteredData)
    })

}

//* Structure for post div
let postsDivStructure = (el) => {
    let item = document.createElement('div')
    let actionsDiv = document.createElement('div')
    let title = document.createElement('p')
    let body = document.createElement('p')
    let modifyButton = document.createElement('button')
    let showCommentsButton = document.createElement('button')
    let comments = document.createElement('div')

    item.setAttribute('class', 'post')
    title.setAttribute('class', 'post-title')
    body.setAttribute('class', 'post-body')
    actionsDiv.setAttribute('class', 'action-buttons')
    modifyButton.setAttribute('class', 'modify-button')
    modifyButton.addEventListener('click', (e) => openModal(e, 'modify'))
    showCommentsButton.addEventListener('click', (e) => showComments(e))
    showCommentsButton.className = 'show-comments'
    comments.setAttribute('id', `comments-${el.id}`)
    comments.setAttribute('class', `comments`)


    modifyButton.id = el.id
    showCommentsButton.id = `comments-${el.id}`

    title.innerHTML = el.title
    body.innerHTML = el.body
    modifyButton.innerHTML = 'Modify Post'
    showCommentsButton.innerHTML = 'Show comments'

    item.appendChild(title)
    item.appendChild(body)
    actionsDiv.appendChild(modifyButton)
    actionsDiv.appendChild(showCommentsButton)
    item.appendChild(actionsDiv)
    item.appendChild(comments)
    info.appendChild(item)

}

//* Render(re-render) passed object
async function render(data) {
    clearList(info)
    if (data) {
        data.forEach(el => {

            if (el.body && el.title) {
                postsDivStructure(el);
            }

        })
    } else {
        data = await fetchData('posts');
        render(data)
    }
}

export {
    data,
    modal
}