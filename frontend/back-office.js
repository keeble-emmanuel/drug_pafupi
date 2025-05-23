const username= document.getElementById('username');
const password = document.getElementById('password');
const signInBtn = document.getElementById("sign-in-btn");
const wrongCredentials = document.getElementById('wrong-credentials')

const personData = JSON.parse(localStorage.getItem("person-info")) || [];
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
        window.location.href = 'back-office-y.html';
        const user = { user_id: response.user_id}
        if(!personData){
            personData.unshift(user);
        }else{
            personData.pop()
            personData.unshift(user); 
        }
        personData.pop()
        personData.unshift(user);
        localStorage.setItem('person-info', JSON.stringify(personData))
        
        
    }else{
        wrongCredentials.style.display = 'block'
    }
}
signInBtn.addEventListener('click', ()=>{ 
    //window.location.href = 'back-office-y.html';
    postSignIn()
    username.value= ""
    password.value = ""
})
