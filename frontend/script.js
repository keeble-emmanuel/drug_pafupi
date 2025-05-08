const searchBtn = document.getElementById('search-btn');
const displaySearchResults = document.getElementById('search-results')
const searchKey = document.getElementById('search-input')

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
       const data = await start.json()
       console.log(data)

    }catch(err){
        console.error(err)
    }
    
}

searchKey.addEventListener('keyup', ()=>{
    fetchResults()
    displaySearchResults.className = 'search-result'
    displaySearchResults.innerHTML= `
      
        <p>'${searchKey.value}'</p>
    `
})
searchBtn.addEventListener('click', ()=>{
    fetchResults()
    displaySearchResults.className = 'search-result'
    displaySearchResults.innerHTML= `
        <h2>results</h2>
        <p>'${searchKey.value}'</p>
    `
    
})