const productsThumbnailDiv = document.getElementById('products-thumbnail-div')
const productsThumbnailDivB = document.getElementById('products-thumbnail-div-b')
const citySelected = document.getElementById('cities')

const searchFiters = JSON.parse(localStorage.getItem("searchfilter")) || [];


const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/searched-page/${searchFiters[0].genericName}/${searchFiters[0].tradeName}`)
    const results = await fetched.json();
    console.log(results)
    const productsThumbnailDiv = document.createElement('div');
    productsThumbnailDiv.id = "products-thumbnail-div";
    productsThumbnailDivB.textContent = '';
    var citiesz = ['zomba', 'blantyre', 'lilongwe', 'mzuzu']
    //
    var drugstrengthArray = [];
    
    results.forEach((el)=>{
        drugstrengthArray.unshift(el.drugStrength)
    })
    var drugstrengthArray2 = [... new Set(drugstrengthArray)];
    console.log(drugstrengthArray, drugstrengthArray2)
    
    //
    var resultsFiltered = results.filter((el)=>{
        var city = !el.user_id.city ?'other': !citiesz.includes(el.user_id.city.toLowerCase().trim())? 'other':el.user_id.city;
        return city.toLowerCase().trim() == citySelected.value
    })
    if(citySelected.value == 'all'){
        resultsFiltered =  results;
    }
    
    resultsFiltered.forEach((el)=>{
        var img = el.dosageForm == 'tablet' || el.dosageForm == 'capsules' ?'download.png':
            el.dosageForm == 'solution' || el.dosageForm == 'powder-for-reconstitution'?'istockphoto-1304499871-612x612.jpg':
            el.dosageForm == 'syrup'?'syrup.avif':
            el.dosageForm =='ointment'? 'gettyimages-182665593-612x612.jpg':'eye.jpg'
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <div id="product-thumbnail-name-pcy">
                    <p >${el.user_id.name} pharmacy</p>
                </div>
                <div class="search-thumbnail-details">
                    <div class="product-details">
                        <p>MWK ${el.price?el.price:'N/A'} </p>
                    </div>
                    <div class="location-icon">
                        <a 
                        href='https://www.google.com/maps/search/?api=1&query=${el.user_id.location[0]},${el.user_id.location[1]}'
                        ><img src="location2.svg" class="icon"/>
                        </a>
                        
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
