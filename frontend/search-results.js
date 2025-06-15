const productsThumbnailDiv = document.getElementById('products-thumbnail-div')
const productsThumbnailDivB = document.getElementById('products-thumbnail-div-b')
const citySelected = document.getElementById('cities')

const searchFiters = JSON.parse(localStorage.getItem("searchfilter")) || [];


const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/searched-page/${searchFiters[0].genericName}/${searchFiters[0].tradeName}`)
    const results = await fetched.json();
    const productsThumbnailDiv = document.createElement('div');
    productsThumbnailDiv.id = "products-thumbnail-div";
    productsThumbnailDivB.textContent = '';
    var resultsFiltered = results.filter((el)=>{
        
        var city = el.user_id.city ? el.user_id.city.toLowerCase() : 'other'
        console.log(city.toLowerCase(), citySelected.value)
        return city.trim() === citySelected.value
    })
    if(citySelected.value == 'all'){
        resultsFiltered =  results;
    }
    console.log(resultsFiltered, results)
    resultsFiltered.forEach((el)=>{
        var img = el.dosageForm == 'tablet' || el.dosageForm == 'capsules' ?'download.png':
            el.dosageForm == 'solution' || el.dosageForm == 'powder-for-reconstitution'?'istockphoto-1603361100-612x612.jpg':
            el.dosageForm =='ointment'? 'photo-1631549916768-4119b2e5f926.jpeg':'photo-1607619056574-7b8d3ee536b2.jpeg'
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src='${img}'/>
                <div class="search-thumbnail-details">
                    <div class="product-details">
                        <p class="text-center">${el.tradeName} ${el.drugStrength}</p>
                    </div>
                    
                    <div class="product-details">
                        <p>MWK ${el.price?el.price:'N/A'}<img src="cart.svg" class="icon"/> </p>
                    </div>
                    
                    <div class="product-details">
                    <p>${el.user_id.name}<a 
                    href='https://www.google.com/maps/search/?api=1&query=${el.user_id.location[0]},${el.user_id.location[1]}'
                    ><img src="location2.svg" class="icon"/></a>
                    </p>
                    </div>
                </div>
                
            </div>
            
    `
    })
    productsThumbnailDivB.appendChild(productsThumbnailDiv)
    
}
fetchData()

citySelected.addEventListener('change', ()=>{
    //alert('sss')
    
    fetchData();
})
