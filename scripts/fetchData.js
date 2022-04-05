//* Fetch data from server
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
        console.log(typeof error);
        return error
    }
}

//* Remove all child before re-render
function clearList(elToClear) {
    console.log(elToClear)
    while (elToClear.firstChild) {
        elToClear.removeChild(elToClear.firstChild);
    }
}

export {fetchData, clearList}

