const registeredAccounts = document.getElementById("registered_accounts");



const fetchRegisterOfAccounts =async()=>{
    const fetch = await fetch('/all-accounts')
    const response = await fetch.json()
    response.forEach((el)=>{
        registeredAccounts.innerHTML = `
            <div>

                <img src=""/>
                <p>details</p>

            </div>
        `
    })
}