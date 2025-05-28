const regAccounts = document.getElementById("registered-accounts");
const nameOfUser = document.getElementById('name');
const locationOfUser = document.getElementById('location')
const contactOfUser = document.getElementById('contact')
const cityOfUser = document.getElementById('city')
const username = document.getElementById('username')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirm');
const createAccBtn = document.getElementById("create-account")



const fetchRegisterOfAccounts =async()=>{
    const fetchs = await fetch(`${window.location.origin}/all-users`)
    const response = await fetchs.json()
    console.log(response)
    response.forEach((el)=>{
        regAccounts.innerHTML += `
            <div class="individual-account">
                    <img src=""/>
                    <p class="text-center">${el.name} (${el.location})</p>
                    <div id="button-div">
                        <button id='${el._id}' class="text-center view-user" onclick="deleteUserMain()">visit</p>
                        <button class="text-center view-user">delete</p>
                    </div>
                    
                </div>
        `
    })
}
const postNewaccount =async()=>{
    try{
        const postss = await fetch(`${window.location.origin}/new-user`, 
        {
             method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameOfUser.value,
                city: cityOfUser.value,
                locationOfUser: locationOfUser.value,
                phone: contactOfUser.value,
                username: username.value,
                password:password.value,

            })
        }
        
    )
        //const response = postss.json();
        //console.log(response)
    }
    catch(err){
        console.error(err)
    }
    
    
}

const deleteUser =async(par)=>{
    const fetchs = await fetch(`${window.location.origin}/keeble/delete-user/${par}`)
    const response = await fetchs.json()
    console.log(response)
}

const deleteUserMain=()=>{
    const idtodelete = event.target.id
    console.log(idtodelete);
    deleteUser(idtodelete)
    window.location.reload()
}

fetchRegisterOfAccounts()
createAccBtn.addEventListener('click', ()=>{
    postNewaccount()
})
