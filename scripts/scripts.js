model = {
    postsData: [],
    albumsData: []
}

view = {
    clearList: function() {
		var range = document.createRange();
		range.selectNodeContents(document.getElementById("info"));
		range.deleteContents();
	},
    
    renderPosts: async function(){
        this.clearList();

        console.log(model.postsData)

        info = document.getElementById("info")

        model.postsData == [] ? model.postsData = await controller.fetchData('posts') : document.getElementById("info").innerHTML = 'No data right now'
        
        if(model.postsData){
            model.postsData.forEach(element => {
                div = document.createElement('div')
                div.innerHTML = model.postsData[element].body
                info.appendChild(div)
                console.log('div')
            });
        }
    }
}

controller = {
    fetchData: async function(type) {
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
}