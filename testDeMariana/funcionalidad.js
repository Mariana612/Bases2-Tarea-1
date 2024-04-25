function fetchUserData() {
    const username = document.getElementById('usernameInput').value;
    fetch(`http://localhost:3001/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('userInfoDisplay').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            document.getElementById('userInfoDisplay').innerHTML = `Error: ${error.message}`;
        });
}

