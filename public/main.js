const HEROKU_API_ROOT = "https://destinations-vacations-api.herokuapp.com"
// const HEROKU_API_ROOT = "http://localhost:3000"

// Make a request to /GET destinations
const destinations_url = `${HEROKU_API_ROOT}/destinations`

fetch(destinations_url)
    .then(res => res.json())
    .then((destinations) => {
        renderCards(destinations)
    })

// Make a request to /POST destinations

const button_form = document.querySelector('#button_form')
button_form.addEventListener('click', postRequest)

function postRequest(e) {
    e.preventDefault();

    let name = document.querySelector('#input_name').value
    let location = document.querySelector('#input_location').value
    let photo = document.querySelector('#input_photo').value
    let description = document.querySelector('#input_description').value

    const newDest = {
        name: name,
        location: location,

    }

    if (description !== 0) {
        newDest.description = description
    }

    fetch(destinations_url, {

        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(newDest)
    })
        .then((res) => res.text())
        .then((destinations) => 

            window.location.reload()
        )


}


function renderCards(destinations) {

    const wistListContainer = document.querySelector('#wistlist_container')
    wistListContainer.innerHTML = "";
    // Create cards for each destinations
    console.log(destinations)
    for (const dest of destinations) {

        const { id, name, location, photo, description } = dest

        const card = document.createElement("div")
        card.classList.add("card")
        card.style.width = "18rem"

        card.innerHTML = `
        <img class="card-img-top" src=${photo} alt=${name}>
        <div id=${id} class="card-body">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">${location}.</p>
          <p class="card-text">${description}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
        `

        // Append card to #wish_list container
        wistListContainer.append(card)

        // Add buttons
        const editBtn = document.createElement("btn")
        editBtn.classList.add("btn", "btn-warning")
        editBtn.setAttribute("destId", id)
        editBtn.innerText = "Edit me"
        editBtn.addEventListener("click", handleEdit)

        const deleteBtn = document.createElement("btn")
        deleteBtn.classList.add("btn", "btn-danger")
        deleteBtn.setAttribute("destId", id)
        deleteBtn.innerHTML = "Delete"
        deleteBtn.addEventListener("click", handleDelete)

        document.getElementById(id).append(editBtn)
        document.getElementById(id).append(deleteBtn)
    }


}

let editButtons = document.getElementsByClassName("editButton")

Array.from(editButtons).forEach(function (button) {

    button.addEventListener('click', handleEdit)
})

function handleEdit(e) {
    let editBtn = e.target
    const id = editBtn.getAttribute("destId")


    const cardBody = editBtn.parentElement;
    const card = cardBody.parentElement;
    console.log(card, cardBody, editBtn)


    const oldName = cardBody.children[0];
    const oldLocation = cardBody.children[1]
    const oldDescription = cardBody.children[2]
    const oldPhoto = card.children[0]

    let newName = prompt("New destination name", oldName.innerText);
    let newLocation = prompt("New location name", oldLocation.innerText);
    let newDescription = prompt("New description name", oldDescription.innerText);

    const newDestination = { id }

    newDestination.name = newName;
    newDestination.location = newLocation
    newDestination.description = newDescription
    console.log(newName)
    console.log(newDestination)

    fetch(`${destinations_url}`, {
        method: "PUT",
        body: JSON.stringify(newDestination),
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if (data.message) {
                alert(data.message, "danger")
            } else {
                oldName.innerText = data.name
                oldLocation.innerText = data.location
                oldDescription.innerText = data.description
                oldPhoto.setAttribute("src", data.photo)
            }
        })
        .then(function () {
            window.location.reload()
        })


}

let deleteButtons = document.getElementsByClassName("deleteButton")

Array.from(deleteButtons).forEach(function (button) {

    button.addEventListener('click', handleDelete)
})
function handleDelete(e) {
    let destId = e.target.getAttribute("destId")
    let url = `${destinations_url}/${destId}`
    console.log(url)

    fetch(url, {
        method: "DELETE"
    })
        .then(res => {
            return res.json()

        })
        .then(data => {
            window.location.reload()
        })
}

function alert(message, type) {
    var wrapper = document.createElement('div')
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`

    var alertPlaceholder = document.getElementById('liveAlertPlaceholder')
    alertPlaceholder.append(wrapper)
}
