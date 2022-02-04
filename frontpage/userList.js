const userTableBody = document.getElementById("user-table-tbody")


fetch(localURL + "/users/")
    .then(response => response.json())
    .then(users => {
        console.log(users);
        console.log(users.id);
        users.map(createUserTableRow);
    });

function createUserTableRow(user) {
    const userTableRow = document.createElement("tr");
    userTableRow.id = "user" + user.id;

    userTableBody.appendChild(userTableRow);
    constructTableRow(userTableRow, user);
}

function constructTableRow(userTableRow, user) {
    userTableRow.innerHTML = `
    <td>
    <a class="a-user-name">${escapeHTML(user.username)}</a>
    </td>
    <td>
    <a class="a-user-description">${escapeHTML(user.description)}</a>
    </td>
    <td>
     <button id="update-button-${user.id}">Update</button>
     <a href="index.html"><button onclick="deleteUser(${user.id})">❌</button></a>
    </td>
    <td>
    <a href="../posts/allPosts.html?userId=${user.id}"><button id="select-user-button-${user.id}">Use this user</button></a>
    </td>
    `;

    document.getElementById(`update-button-${user.id}`)
        .addEventListener("click", () => updateUserInfo(user))
    
}

function updateUserInfo(user) {
    const userTableRowToUpdate = document.getElementById("user"+user.id);
    console.log(user);
    console.log(user.description);

    userTableRowToUpdate.innerHTML = `
    <td>
        <input id="update-user-name-${user.id}" value="${user.username}" placeholder="${user.username}">
    </td>
    <td>
        <textarea class="update-user-description" id="update-user-description-${user.id}">${user.description}</textarea>
    </td>
    <td>
    <a href="index.html"><button onclick="updateUserInformation(${user.id})">Save new user information</button></a>
        <button id="cancel-button-${user.id}">Cancel</button>
    </td>
    `
    document.getElementById(`cancel-button-${user.id}`)
        .addEventListener("click", () => cancelUpdateUser(user))
}

function cancelUpdateUser(user) {
    const userTableRow = document.getElementById("user"+user.id)
    constructTableRow(userTableRow, user);
}

function deleteUser(userId) {
    fetch(localURL + "/users/" + userId, {
        method: "DELETE"
    }).then(response => {
        if (response.status === 200) {
            document.getElementById("user removed").remove();
        } else {
            console.log(response.status);
        }
    });
}

function updateUserInformation(userId) {
    console.log(userId);

    const userInformationToUpdate = {
        id: userId,
        username: document.getElementById(`update-user-name-${userId}`).value,
        description: document.getElementById(`update-user-description-${userId}`).value,
    }
    console.log(userInformationToUpdate);

    fetch(localURL + "/users/" + userId, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(userInformationToUpdate)
    })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                console.log("New user information changed")
            } else {
                console.log("User information was not updated", response.status);
            }
        })
}