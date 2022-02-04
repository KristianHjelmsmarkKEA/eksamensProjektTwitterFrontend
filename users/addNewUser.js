function addNewUser() {

    const newUser = {
        username: document.getElementById(`new-user-username`).value,
        description: document.getElementById(`new-user-description`).value,
    };
    console.log(newUser);

    fetch(localURL + "/users/", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newUser)
    })
        .then(response => {
            if (response.status === 200) {
                console.log("New User added");
            } else {
                console.log("New User not created", response.status);
            }
        })
        .catch(error => console.log("Network related error: ", error));
}