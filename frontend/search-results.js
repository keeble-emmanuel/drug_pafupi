const productsThumbnailDiv = document.getElementById('products-thumbnail-div')
const searchFiters = JSON.parse(localStorage.getItem("searchfilter")) || [];


const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/searched-page/${searchFiters[0].genericName}/${searchFiters[0].tradeName}`)
    const results = await fetched.json();
    console.log(results)
    results.forEach((el)=>{
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="istockphoto-1419246808-612x612.jpg"/>
                <div class="search-thumbnail-details">
                    
                    <p>${el.tradeName} ${el.drugStrength}</p>
                    <div>
                        <p>cart</p>
                    </div>
                    <a 
                    href='https://www.google.com/maps/search/?api=1&query=${el.user_id.location[0]},${el.user_id.location[1]}'
                    >${el.user_id.name}</a>
                </div>
                
            </div>
            
    `
    })
    
}
fetchData()
