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
                    <button class="text-center view-user">visit account</p>
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

fetchRegisterOfAccounts()
createAccBtn.addEventListener('click', ()=>{
    postNewaccount()
})
