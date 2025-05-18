const searchBtn = document.getElementById('search-btn');
const displaySearchResults = document.getElementById('search-results')
const searchKey = document.getElementById('search-input');

const searchFiters = JSON.parse(localStorage.getItem("searchfilter")) || [];
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
        `<li>
            <div class="search-results-div">
                ${el.tradeName}  <b>( ${el.genericName} )</b> sold by ${el.user_id.name}
            </div>
             </li>`

        Array.from(document.getElementsByClassName('search-results-div')).forEach((par)=>{
            par.addEventListener('click', ()=>{
                window.location.href = 'search-results.html'
                filterObj={
                    genericName: el.genericName,
                    tradeName: el.tradeName
                }
                searchFiters.unshift(filterObj)
                localStorage.setItem('searchfilter', JSON.stringify(searchFiters))
            })
        })
        
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
