const queryString = window.location.search;
const URLParams = new URLSearchParams(queryString);
const userId = URLParams.get("userId");
const postGalleryDiv = document.getElementById("post-feed");
let currentHashtags;
let filterdPosts;

fetch(localURL + "/hashtags")
    .then(respones => respones.json())
    .then(hashtags => {
        currentHashtags = hashtags;
        console.log(hashtags);

                fetch(localURL + "/users/" + userId)
                    .then(response => response.json())
                    .then(user => {
                        console.log(user);
                        createNewPostButton(user)

                        fetch(localURL + "/posts")
                            .then(response => response.json())
                            .then(posts => {
                                console.log(posts);
                                filterdPosts = posts;
                                document.getElementById("hashtag-search").addEventListener("input", handleHashtagSearch);
                                posts.map(createPostCard);
                            });
                    });
});



function createNewPostButton(user) {
    const currentUserDiv = document.getElementById("current-user")
    currentUserDiv.innerHTML = `
    <a id="current-user-info">Current User: ${user.username}</a>
    <br><br>
    <label id="add-hashtag-label">Add new Hashtag</label> <input value="#" id="add-new-hashtag"> <a href="allPosts.html"><button onclick="addHashtag()">Save hashtag</button></a>
    <a id="create-new-post-on-user" href="createNewPost.html?userId=${user.id}"><button id="create-new-user">Create new Post</button></a>
    <a href="../frontpage/index.html" id="button-to-index"><button>Switch User</button></a>
    <br><br>
    <input id="hashtag-search" placeholder="Search Hashtag">
    `;

}

function createPostCard(post) {
    const cardElement = document.createElement("div");
    cardElement.className = "inner-post-div";

    cardElement.innerHTML = `
    <a href="editPost.html?postId=${post.id}">
        <a class="a-post-username">${escapeHTML(post.user.username)}</a>
        <a class="a-test-post-date">Posted: ${new Date(post.createdDate).toLocaleString()}</a> 
        
    </a>
        <div class="text-wrapper">
                <p id="post-feed-text">${post.text} </p>
                <a id="post-feed-hashtag">${post.hashtag.tag}</a>
                <div class="image-wrapper">
                <img src="${post.postImage}">
            </div>
            <a href="editPost.html?postId=${post.id}" id="button-on-post-feed"><button type="button" onclick="editPost(${post.id})">Edit post</button></a>
        <a href="allPosts.html?postId=${post.id}"><button onclick="deletePost(${post.id})">Delete post</button></a>

    </div>
    
    `;

    postGalleryDiv.appendChild(cardElement);
}


function deletePost(postId) {
    fetch(localURL + "/posts/" + postId, {
        method: "DELETE"
    }).then(response => {
        if (response.status === 200) {
            document.getElementById("post removed").remove();
        } else {
            console.log(response.status);
        }
    });
}

function addHashtag() {

    const newHashtag = {
        tag: document.getElementById("add-new-hashtag").value
    };
    console.log(newHashtag);

    fetch(localURL + "/hashtags", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(newHashtag)
    })
        .then(response => {
            if (response.status === 200) {
                console.log("New hashtag added");
            } else {
                console.log("New hashtag not created", response.status);
            }
        })
        .catch(error => console.log("Network related error: ", error));


}

function handleHashtagSearch(event) {
    postGalleryDiv.innerHTML = "";
    filterdPosts.filter(post => post.hashtag.tag.toLowerCase().includes(event.target.value.toLowerCase())).map(createPostCard);
}

