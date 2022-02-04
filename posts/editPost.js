const queryString = window.location.search;
const URLParams = new URLSearchParams(queryString);
const postId = URLParams.get("postId");
const hashtagSelect = document.getElementById(`edit-drop-down-hashtags`);
const imageUrl = document.getElementById(`edit-image-link`);
const textarea = document.getElementById(`edit-textarea-input`);
let currentHashtag;


fetch(localURL + "/hashtags")
    .then(response => response.json())
    .then(hashtags => {
        currentHashtag = hashtags;
        hashtags.map(optionsHashtags);

        fetch(localURL + "/posts/" + postId)
            .then(response => response.json())
            .then(post => {
                console.log(post)

                hashtagSelect.value = post.hashtag.tag;
                imageUrl.value = post.postImage;
                textarea.value = post.text;
            });
    });

function optionsHashtags(hashtag) {
    const hashtagOptions = document.createElement("option");

    hashtagOptions.id = hashtag.id;
    console.log(hashtag)

    hashtagOptions.innerHTML = hashtag.tag;
    hashtagSelect.appendChild(hashtagOptions);
}

function editPostInformation() {
    const chosenHashtag = currentHashtag.filter(hashtag => hashtag.tag === hashtagSelect.value);

    const postInformationToUpdate = {
        postImage: document.getElementById(`edit-image-link`).value,
        text: document.getElementById(`edit-textarea-input`).value,
        hashtag: chosenHashtag[0]
    };
    console.log(postInformationToUpdate);

    fetch(localURL + "/posts/" + postId, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(postInformationToUpdate)
    })
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                console.log("New post information changed")
            } else {
                console.log("Post information was not updated", response.status);
            }
        })
}