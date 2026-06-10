const loginForm = document.querySelector('.sign-container');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const identifier = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if(!identifier || !password){
        alert('Please fill all fields')
        return
    }

    try{
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ identifier, password })
        })
        if (!response.ok) {
            const message = await response.text();
            alert('Login failed: ' + message);
            return;
        }

        const user = await response.json()
        localStorage.setItem('user', JSON.stringify(user))
        window.location.href = './todo.html';
    } catch (error){
        console.log(error)
        alert('Login error. Make the server is running and check the database connection.')
    }
})