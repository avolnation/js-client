import {data, modal} from "./posts.js"
//* Open modal
let openModal = (el, action) => {
    // console.log(el.id)
    if(action == 'modify' || action =='add comment to'){
        let id = el.target.id;
        let title, body;
        if (action == 'modify') {
            // console.log(data[el])
            data.forEach(el => {
                if(el.id == id){
                    title = el.title
                    body = el.body
                }
            })
            document.querySelector(".post-title").innerHTML = title
            document.querySelector(".post-body").innerHTML = body
            localStorage.setItem('btn-id', el.target.id)
        }
    
        if (action == 'add comment to') {
            localStorage.setItem('btn-id', el.target.id)
        }
    
    }
    localStorage.setItem('action', action)
    document.querySelector("#action").innerHTML = `You're about to ${action} post`
    
    modal.style.display = "block";
}

export {openModal}