const registeredAccounts = document.getElementById("registered_accountsx");
const name = document.getElementById('name');
const location = document.getElementById('location')
const contact = document.getElementById('contact')
const city = document.getElementById('city')
const username = document.getElementById('username')
const password = document.getElementById('password')
const confirmPassword = document.getElementById('confirm')



const fetchRegisterOfAccounts =async()=>{
    const fetchs = await fetch(`${window.location.origin}/all-users`)
    const response = await fetchs.json()
    console.log(response)
    response.forEach((el)=>{
        registeredAccounts.innerHTML += `
            <div class="individual-account">
                    <img src=""/>
                    <p class="text-center">${el.name} (${el.location})</p>
                    <button class="text-center view-user">visit account</p>
                </div>
        `
    })
}

fetchRegisterOfAccounts()
