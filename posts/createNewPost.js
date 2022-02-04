const queryString = window.location.search;
const URLParams = new URLSearchParams(queryString);
const userId = URLParams.get("userId");
const hashtagSelect = document.getElementById(`drop-down-hashtags`);
let currentUser;
let currentHashtag;


const newPostDiv = document.getElementById("new-post-div");



fetch(localURL + "/hashtags")
    .then(response => response.json())
    .then(hashtags => {
        currentHashtag = hashtags;
        hashtags.map(optionsHashtags);

        fetch(localURL + "/users/" + userId)
            .then(response => response.json())
            .then(user => {
                currentUser = user;
                console.log(user);

            });
    });
document.getElementById("button-save-post").addEventListener("click", createNewPost);


function optionsHashtags(hashtag) {

    const hashtagOptions = document.createElement("option");

    hashtagOptions.id = hashtag.id;
    console.log(hashtag)

    hashtagOptions.innerHTML = hashtag.tag;
    hashtagSelect.appendChild(hashtagOptions);
}


function createNewPost() {
    const chosenHashtag = currentHashtag.filter(hashtag => hashtag.tag === hashtagSelect.value);

    const newPost = {
        authorUser: currentUser.username,
        createdDate: new Date(),
        postImage: document.getElementById(`image-link`).value,
        text: document.getElementById(`textarea-input`).value,
        user: currentUser,
        hashtag: chosenHashtag[0]
    };
    console.log(newPost);

    fetch(localURL + "/posts", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newPost)
    })
        .then(response => {
            if (response.status === 200) {
                console.log("New Post added");
            } else {
                console.log("New Post not created", response.status);
            }
        })
        .catch(error => console.log("Network related error: ", error));
}