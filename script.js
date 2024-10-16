// Initialize counters and comments array
let likes = 0, dislikes = 0, comments = [];

// Function to manage cookies
const cookieManager = {
    get: name => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    },
    set: (name, value, days) => {
        const expires = `expires=${new Date(Date.now() + days * 864e5).toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    },
    delete: name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
};

// Initialize the page state from cookies
const initializePage = () => {
    likes = parseInt(cookieManager.get('like')) || 0;
    dislikes = parseInt(cookieManager.get('dislike')) || 0;
    document.getElementById("likebtn").innerHTML = `👍 ${likes}`;
    document.getElementById("dislikebtn").innerHTML = `👎 ${dislikes}`;
    
    const savedComments = cookieManager.get('comments');
    if (savedComments) {
        comments = JSON.parse(savedComments);
        updateCommentsUI();
    }
};

// Update the comments UI
const updateCommentsUI = () => {
    const commentList = document.querySelector('.commentlist');
    commentList.innerHTML = comments.map(comment => `<p>${comment}</p>`).join('');
};

// Vote handling
const handleVote = (isLike) => {
    const voted = cookieManager.get('voted');
    if (voted) {
        const currentVote = cookieManager.get('currentVote');
        if (currentVote === (isLike ? 'like' : 'dislike')) {
            alert("You have already voted!");
            return;
        }
        isLike ? (dislikes--, likes++) : (likes--, dislikes++);
    } else {
        isLike ? likes++ : dislikes++;
        cookieManager.set('voted', 'true', 365);
    }
    cookieManager.set(isLike ? 'like' : 'dislike', isLike ? likes : dislikes, 365);
    cookieManager.set('currentVote', isLike ? 'like' : 'dislike', 365);
    document.getElementById("likebtn").innerHTML = `👍 ${likes}`;
    document.getElementById("dislikebtn").innerHTML = `👎 ${dislikes}`;
};

// Event listeners
document.getElementById('likebtn').addEventListener('click', () => handleVote(true));
document.getElementById('dislikebtn').addEventListener('click', () => handleVote(false));

document.getElementById('submit').addEventListener('click', () => {
    const commentInput = document.getElementById('comment').value.trim();
    if (commentInput) {
        comments.push(commentInput);
        cookieManager.set('comments', JSON.stringify(comments), 365);
        updateCommentsUI();
    }
    document.getElementById('comment').value = '';
});

document.getElementById('clear').addEventListener('click', () => {
    likes = dislikes = 0;
    comments = [];
    ['like', 'dislike', 'voted', 'currentVote', 'comments'].forEach(cookieManager.delete);
    document.getElementById("likebtn").innerHTML = `👍 ${likes}`;
    document.getElementById("dislikebtn").innerHTML = `👎 ${dislikes}`;
    updateCommentsUI();
});

// Initialize the page state on load
initializePage();



