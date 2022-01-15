let ul = document.querySelector('.links-container');

auth.onAuthStateChanged( (user) => {
    if( user ) {
        //if user is logged in then display dashboard and logout options
        ul.innerHTML += `
        <li class="list-item"> <a href="/admin" class="link">Dashboard</a> </li>
        <li class="list-item"> <a href="#" onclick = "logoutUser()" class="link">Logout</a> </li>           
        `
    }  
    else {
        ul.innerHTML += `
        <li class="list-item"> <a href="/admin" class="link">Login</a> </li>
        `
    }
});