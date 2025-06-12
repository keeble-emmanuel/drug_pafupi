const productsThumbnailDivB = document.getElementById('products-thumbnail-div-b');
const citySelected = document.getElementById('cities');
let resultsFiltered;

const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/all-products`)
    const results = await fetched.json();
    console.log(results);
    const productsThumbnailDiv = document.createElement('div');
    productsThumbnailDiv.id = "products-thumbnail-div";
    productsThumbnailDivB.textContent = '';
    var resultsFiltered = results.filter((el)=>{
        
        var city = el.user_id.city ? el.user_id.city : 'lilongwe'
        return city.toLowerCase() == citySelected.value
    })
    if(citySelected.value == 'all'){
        resultsFiltered =  results;
    }
    console.log(resultsFiltered)
    resultsFiltered.forEach((el)=>{
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="istockphoto-1419246808-612x612.jpg"/>
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
fetchData();

citySelected.addEventListener('change', ()=>{
    //alert('eee')
    fetchData()
})
