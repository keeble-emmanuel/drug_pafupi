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
       info.forEach(el => {
        displaySearchResults.innerHTML +=
        `<p>${el.genericName}</p>`
       });
    }catch(err){
        console.error(err)
    }
    
}

/*searchKey.addEventListener('keyup', ()=>{
    fetchResults()
    displaySearchResults.className = 'search-result'
    displaySearchResults.innerHTML= `
      
        <p>'${searchKey.value}'</p>
    `
})*/
searchBtn.addEventListener('click', ()=>{
    fetchResults()
    displaySearchResults.className = 'search-result'
   
    
    
})
