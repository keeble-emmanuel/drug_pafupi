const username= document.getElementById('username');
const password = document.getElementById('password');
const signInBtn = document.getElementById("sign-in-btn");


const postSignIn = async()=>{
    const post = await fetch(`${window.location.origin}/sign-in`, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value
        })
    })
    const response = await post.json()
    console.log(response)
    const { entry } = response
    console.log(entry)
    if(entry== 'ok'){
        window.location.href = 'back-office-y.html'
        
    }else{
        alert('wrong password')
    }
}
signInBtn.addEventListener('click', ()=>{ 
    //window.location.href = 'back-office-y.html';
    postSignIn()
    username.value= ""
    password.value = ""
})
