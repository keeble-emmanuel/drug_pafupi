const productsThumbnailDiv = document.getElementById('products-thumbnail-div')
const productsThumbnailDivB = document.getElementById('products-thumbnail-div-b')
const citySelected = document.getElementById('cities')
const nameDisplay = document.getElementById('drug-names')
const avg_price_display = document.getElementById('avg_price');
const loadingScreen = document.getElementById('loading-screen')

const searchFiters = JSON.parse(localStorage.getItem("searchfilter")) || [];
nameDisplay.textContent  = searchFiters[0].genericName +' (' + searchFiters[0].tradeName + ')'
var allData = []
var filtered = []
const fetchData =async()=>{
    loadingScreen.style.display = 'grid'
    const fetched = await fetch(`${window.location.origin}/searched-page`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            generic:searchFiters[0].genericName,
            trade:searchFiters[0].tradeName
        })
    })
    const results = await fetched.json();
    allData = results;
    console.log(results)
    //
    var drugstrengthArray = [];
    
    results.forEach((el)=>{
        drugstrengthArray.unshift(el.drugStrength)
    })
    var drugstrengthArray2 = [... new Set(drugstrengthArray)];
    console.log(drugstrengthArray, drugstrengthArray2)
    document.getElementById('strength-select').innerHTML =`
        <option value = "all">all</option>
    `
    drugstrengthArray2.forEach((el)=>{
        document.getElementById('strength-select').innerHTML +=`
            <option value=${el}>${el}</option>
        `
    })
    //
    var drugformArray = [];
    
    results.forEach((el)=>{
        drugformArray.unshift(el.dosageForm)
    })
    var drugformArray2 = [... new Set(drugformArray)];
    console.log(drugformArray, drugformArray2)
    document.getElementById('formulation-select').innerHTML =`
        <option value="all">all</option>
    `
    drugformArray2.forEach((el)=>{
        document.getElementById('formulation-select').innerHTML +=`
            <option value=${el}>${el}</option>
        `
    })

    //data
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
    loadingScreen.style.display = 'none'
    
}


const filterFetchData =async(params)=>{
   
    var citiesz = ['zomba', 'blantyre', 'lilongwe', 'mzuzu']
    //
    var drugstrengthArray = [];
    
    params.forEach((el)=>{
        drugstrengthArray.unshift(el.drugStrength)
    })
    var drugstrengthArray2 = [... new Set(drugstrengthArray)];
    console.log(drugstrengthArray, drugstrengthArray2)
    
    //filter by city
    var resultsFiltered = params.filter((el)=>{
        if(citySelected.value == 'all'){
            return resultsFiltered =  params;
        }else{
            var city = !el.user_id.city ?'other': !citiesz.includes(el.user_id.city.toLowerCase().trim())? 'other':el.user_id.city;
            return city.toLowerCase().trim() == citySelected.value
        }
        
    })
    console.log(resultsFiltered, '0', document.getElementById('strength-select').value)
    //
    var resultsFiltered1 = resultsFiltered.filter((el)=>{
        if(document.getElementById('strength-select').value == 'all'){
            console.log(resultsFiltered)
            return resultsFiltered1 = resultsFiltered
        }else{
            return el.drugStrength == document.getElementById('strength-select').value
        }
        
    })
    console.log(resultsFiltered1)
    //
    var resultsFiltered2 = resultsFiltered1.filter((el)=>{
         if(document.getElementById('formulation-select').value == 'all'){
            return resultsFiltered2 = resultsFiltered1
        }else{
            return el.dosageForm == document.getElementById('formulation-select').value
        }
        
    })
    console.log(resultsFiltered2)
    //
    var priceArray = []
    var avg_price = 0
    resultsFiltered2.forEach((el)=>{
        priceArray.unshift(el.price)
        console.log(priceArray,'ooo')
        
    })
    console.log(priceArray)
    var total = priceArray.reduce((a, b)=>{
            return parseFloat(a) + parseFloat(b)
        }, 0)
    console.log(total, "total", resultsFiltered2.length)
    var divded =resultsFiltered2.length
    avg_price = isNaN(parseFloat(total) / parseFloat(divded)) ? 0.00 : parseFloat(total) / parseFloat(divded)
    console.log(avg_price, divded)
    avg_price_display.textContent = 'AVG_Price: K'+ avg_price.toFixed(2)
    filtered = resultsFiltered2
    
}

const displaynow=async(params)=>{
    const productsThumbnailDiv = document.createElement('div');
    productsThumbnailDiv.id = "products-thumbnail-div";
    productsThumbnailDivB.textContent = '';
    params.forEach((el)=>{
        const loc = JSON.parse(el.location)
        console.log(loc)
        
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <div id="product-thumbnail-name-pcy">
                    <p >${el.name} pharmacy</p>
                </div>
                <div class="search-thumbnail-details">
                    <div class="product-details bar">
                        <p><b> K${el.price}</b></p>
                    </div>
                    <div class="product-details bar">
                        <p>${el.drugStrength?el.drugStrength:'N/A'}</p>
                    </div>
                    <div class="location-icon bar">
                        <a 
                        href=${loc?`https://www.google.com/maps/search/?api=1&query=${loc[0]},${loc[1]}`:'#'} target="_blank" rel="noopener noreferrer" title=${loc?'view location on map':'location not set'} style="color:inherit;"
                        ><i class="fa-solid fa-location-dot"></i>
                        </a>
                        
                    </div>
                </div>
                
            </div>
            
    `
    })
    productsThumbnailDivB.appendChild(productsThumbnailDiv)
    loadingScreen.style.display = 'none';
}

const organise=async()=>{
    await fetchData();
    await filterFetchData(allData)
    displaynow(filtered)
}

organise()

citySelected.addEventListener('change', async()=>{   
    await filterFetchData(allData)
    displaynow(filtered)
})
document.getElementById('strength-select').addEventListener('change', async()=>{
    await filterFetchData(allData)
    displaynow(filtered)
})
document.getElementById('formulation-select').addEventListener('change', async()=>{
    await filterFetchData(allData)
    displaynow(filtered)
})
