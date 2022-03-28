

let btn = document.getElementById("info")

// btn.addEventListener("click", )

// btn.append()


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

async function renderData(id) {
    const data = await fetchData(id);;
    console.log(data);
}

renderData('posts');