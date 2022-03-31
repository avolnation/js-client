var data = [];
var commentsData = new Map();
let modal = document.getElementById('myModal');
let btn = document.getElementById("btn");
let span = document.getElementsByClassName("close")[0];
let info = document.getElementById("info-filling");
let form = document.getElementById("modifyPost");
let posts = document.getElementById("posts");
let inf = document.getElementById("info");

window.addEventListener("load", async function () {
    console.log("All resources finished loading!");
    addNavButtons();
});


let addComment = (e, ...args) => {
    e.preventDefault();
    console.log(args[0])
    let id = localStorage.getItem('btn-id')
    console.log(id)
    let commsId = parseInt(id.match(/\d+/));
    e.preventDefault();
    let values = getValuesFromModal();
    if(commentsData.has(commsId)){
        map.set(commsId ,map.get(commsId).push({
            postId: commsId,
            id: commentsData.length,
            body: values['form-body'],
            name: values['form-title']
        }))}
        else{
            map.set(commsId, [{postId: commsId,
                id: commentsData.length,
                body: values['form-body'],
                name: values['form-title']}]
            )
        }
    let commentsDiv = document.querySelector(`div#${id}`)
    // console.log(id)
    console.log(commentsDiv)
    clearList(commentsDiv)
    showComments(e)
    // clearList(document.querySelector(`.comments-${id}`))

    form.reset()
    modal.style.display = "none";


}

let showComments = async (e) => {
    let eId = e.target.id;

    let id = parseInt(eId.match(/\d+/))

    // console.log(e)
    // console.log(e.id)
    let comms = document.querySelector(`div#${eId}`)
    clearList(comms)
    console.log(comms)
    let p = document.createElement('p')
    let addCommentButton = document.createElement('button')
    p.innerHTML = 'Comments:'

    addCommentButton.addEventListener('click', (e) => openModal(e, 'add comment to'))
    addCommentButton.setAttribute('id', `${eId}`)
    addCommentButton.innerHTML = 'Add Comment'

    comms.appendChild(p)

    if (commentsData) {
        // console.log(commentsData)
        // console.log(e)
        // console.log(info)

        // console.log(e.id)


        console.log(parseInt(eId.match(/\d+/)))

        commentsData.forEach(el => {
            // console.log(e.id)
            // console.log(el.postId)
            if (id == el.postId) {
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
            }
        })
        comms.appendChild(addCommentButton)
    } else {
        clearList(comms)
        comms.innerHTML = 'Waiting for server response'
        let commentsForParticularPost = await fetchData(`comments?postId=${id}`);
        console.log(commentsForParticularPost)
        if (commentsForParticularPost.length) {
            commentsData = [...commentsData, ...commentsForParticularPost]
            console.log(commentsData)
            comms.innerHTML = ''
            showComments(e)
        }
        // comms.innerHTML = 'No data, from server'
        // showComments(e)
    }
}

form.addEventListener('submit', (e) => {
    let lsAction = localStorage.getItem('action');
    if (lsAction == 'add') {
        addPost(e)
    }
    if (lsAction == 'modify') {
        modifyPost(e)
    }
    if (lsAction == 'add comment to') {
        addComment(e, e.target.id)
    }
});

// posts.addEventListener('click', () => {
//     addPostBtn(); 
// })

//Deleting all child elements before we re-render them 
function clearList(elToClear) {
    console.log(elToClear)
    while (elToClear.firstChild) {
        elToClear.removeChild(elToClear.firstChild);
    }
}

let openModal = (el, action) => {
    // console.log(el.id)
    localStorage.setItem('action', action)
    document.querySelector("#action").innerHTML = `You're about to ${action} post`
    if (action == 'modify') {
        // console.log(data[el])
        document.querySelector(".postTitle").innerHTML = data[el.target.id].title
        document.querySelector(".postBody").innerHTML = data[el.target.id].body
    }
    localStorage.setItem('btn-id', el.target.id)

    modal.style.display = "block";
}

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

let addPost = (e) => {
    e.preventDefault();
    const values = getValuesFromModal();
    data.push({
        id: data.length,
        body: values['form-body'],
        title: values['form-title']
    })

    clearList(info)

    render()

    form.reset()
    modal.style.display = "none";
}

let modifyPost = (e) => {

    e.preventDefault();

    const fields = document.querySelectorAll('input')
    const values = {};
    fields.forEach(field => {
        const {
            name,
            value
        } = field;
        values[name] = value;
    })

    let id = localStorage.getItem('btn-id')

    console.log(e)

    data.forEach(el => {
        if (el.id == id) {
            el.body = values['form-body']
            el.title = values['form-title']
        }
    })


    clearList(info)

    render()

    form.reset()
    resetPosts();
    modal.style.display = "none";

}
let resetPosts = () => {
    document.querySelector(".postTitle").innerHTML = ''
    document.querySelector(".postBody").innerHTML = ''
}

span.onclick = function () {
    modal.style.display = "none";
    form.reset();
    resetPosts();

}

document.addEventListener('click', function (e) {
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
        return error
    }
}

let addNavButtons = () => {
    // clearList(inf)

    let addTaskBtn = document.createElement('button')
    addTaskBtn.innerHTML = 'Add Post'
    addTaskBtn.onclick = () => openModal(0, 'add')

    let fetchPostsBtn = document.createElement('button')
    fetchPostsBtn.innerHTML = 'Fetch posts'
    fetchPostsBtn.onclick = async () => {
        let dataFromFetch = await fetchData('posts');
        data = [...data, ...dataFromFetch];
        render()
    }

    let input = document.createElement('input')
    input.innerHTML = 'Search for posts'
    input.setAttribute('id', 'search')
    input.setAttribute('type', 'text')

    inf.insertBefore(addTaskBtn, info)
    inf.insertBefore(fetchPostsBtn, info)
    inf.insertBefore(input, info)

    let search = document.getElementById("search");

    search.addEventListener("change", (e) => {
        data = data.filter(el => el.title.includes(e.target.value))
        render()
    })

}

async function render() {
    clearList(info)

    // console.log(data)

    if (data) {
        data.forEach(el => {

            if (el.body && el.title) {
                let item = document.createElement('div')
                let title = document.createElement('p')
                let body = document.createElement('p')
                let modifyButton = document.createElement('button')
                let showCommentsButton = document.createElement('button')
                let comments = document.createElement('div')

                item.setAttribute('class', 'post')
                title.setAttribute('class', 'postTitle')
                body.setAttribute('class', 'postBody')
                modifyButton.setAttribute('class', 'modify-button')
                modifyButton.addEventListener('click', (e) => openModal(e, 'modify'))
                showCommentsButton.addEventListener('click', (e) => showComments(e))
                showCommentsButton.className = 'show-comments'
                comments.setAttribute('id', `comments-${el.id}`)



                modifyButton.id = el.id
                showCommentsButton.id = `comments-${el.id}`


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
    } else {
        data = await fetchData('posts');
        render()
    }

}

export {
    fetchData,
    clearList
}