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
        `<li>${el.tradeName}  <b>( ${el.genericName} )</b> sold by </li>`
       });
    }catch(err){
        console.error(err)
    }
    
}

searchKey.addEventListener('keyup', ()=>{
    displaySearchResults.style.backdropFilter ='blur(50px) brightness(30%)';
    displaySearchResults.style.overflow = 'scroll'
    fetchResults()
    
    
})
searchBtn.addEventListener('click', ()=>{
    fetchResults()
    displaySearchResults.className = 'search-result'
   
    
    
})
