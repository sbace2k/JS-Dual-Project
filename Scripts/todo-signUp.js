const signForm = document.querySelector('.signup-form');

signForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if(!name || !email || !password){
        alert('Please fill all fields')
        return
    }
    // if(password.length < 8 || password.length > 30){
    //     alert("Password must be between 8 and 30 characters")
    //     return false
    // }
    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)){
        alert("Password must contain Uppercase, Lowercase, numbers and special character")
        return false
    }
    const cPassword = document.getElementById('cPassword').value;
    if (password !== cPassword) {
        alert('Passwords do not match.');
        return;
    }

    try{
        const response = await fetch('/users',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, email, password })
        })

        if (!response.ok) {
            const errorText = await response.text();
            alert('Sign up failed: ' + (errorText || response.statusText));
            return;
        }

        alert('Sign up successful! Please log in.');
        window.location.href = './todo-login.html';
    } catch (error){
        console.log(error)
        alert('Unable to sign up. Check the server and database.')
    }
})