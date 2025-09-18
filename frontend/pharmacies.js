const productsThumbnailDivB = document.getElementById('products-thumbnail-div-b');
const citySelected = document.getElementById('cities');
let resultsFiltered;

const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/all-users`)
    const results = await fetched.json();
    const productsThumbnailDiv = document.createElement('div');
    productsThumbnailDiv.id = "products-thumbnail-div";
    productsThumbnailDivB.textContent = '';
    var citiesz = ['zomba', 'blantyre', 'lilongwe', 'mzuzu']
    var resultsFiltered = results.filter((el)=>{
        var city = !el.city ?'other': !citiesz.includes(el.city.trim().toLowerCase())?'other': el.city ;
        return city.toLowerCase().trim() == citySelected.value
    })
    if(citySelected.value == 'all'){
        resultsFiltered =  results;
    }
    console.log(resultsFiltered, citySelected.value)
    resultsFiltered.forEach((el)=>{
        const loc = JSON.parse(el.location)
        console.log(loc)
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="istockphoto-1419246808-612x612.webp"/>
                <div class="search-thumbnail-details">
                    <p>${el.name}
                    <a 
                    href=${loc?`https://www.google.com/maps/search/?api=1&query=${loc[0]},${loc[1]}`:'#'} target="_blank" rel="noopener noreferrer" title=${loc?'view location on map':'location not set'} style="color:inherit;"
                    ><i class="fa-solid fa-location-dot"></i></a></p>
                    
                </div>
                <div class='text-center'>${el.city}</div>
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
