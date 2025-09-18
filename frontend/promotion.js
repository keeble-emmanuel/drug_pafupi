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
    var filterpromo = results.filter((el)=>{
        return el.promoted == true;
    })
    console.log(filterpromo)
    var citiesz = ['zomba', 'blantyre', 'lilongwe', 'mzuzu']
    var resultsFiltered = filterpromo.filter((el)=>{
        if(citySelected.value == 'all'){
            return resultsFiltered =  results;
        }else{
            var city = !el.city ?'other': !citiesz.includes(el.city.toLowerCase().trim())? 'other':el.user_id.city;
            return city.toLowerCase().trim() == citySelected.value
        }
       
    })
    
    console.log(resultsFiltered)
    resultsFiltered.forEach((el)=>{
        const loc = JSON.parse(el.location)
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="download.png"/>
                <div class="search-thumbnail-details">
                    <div class="product-details">
                        <p class="text-center">${el.tradeName} ${el.drugStrength}</p>
                    </div>
                    
                    <div class="product-details">
                        <p>MWK ${el.price?el.price:'N/A'} </p>
                    </div>
                    
                    <div class="product-details">
                    <p>${el.name}<a 
                    href=${loc?`https://www.google.com/maps/search/?api=1&query=${loc[0]},${loc[1]}`:'#'} target="_blank" rel="noopener noreferrer" title=${loc?'view location on map':'location not set'} style="color:inherit;"
                    ><i class="fa-solid fa-location-dot"></i></a>
                    </p>
                    </div>
                    <div class="product-details">
                        <p>${el.phone?el.phone:'N/A'} </p>
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
