const searchBtn = document.getElementById('search-btn');
const displaySearchResults = document.getElementById('search-results')
const searchKey = document.getElementById('search-input')
let resut

const fetchResults = async()=>{
    try{
        const start = await fetch(`${window.location.origin}`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                searchWord: searchKey.value
            })
        }
    
       )
       const info = await start.json()
       //console.log(data)
       console.log(info[0])
       resut = info;
       console.log(resut)
       displaySearchResults.textContent = ''
       info.forEach(el => {
        
        displaySearchResults.innerHTML +=
        `<p>${el.genericName}</p>`
       });
    }catch(err){
        console.error(err)
    }
    
}

searchKey.addEventListener('keyup', ()=>{
    fetchResults()
    
})
searchBtn.addEventListener('click', ()=>{
    fetchResults()
    displaySearchResults.className = 'search-result'
   
    
    
})
