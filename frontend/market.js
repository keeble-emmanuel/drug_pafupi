const productsThumbnailDiv = document.getElementById('products-thumbnail-div')

const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/all-users`)
    const results = await fetched.json();
    console.log(results)
    results.forEach((el)=>{
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="pharmacy1.png"/>
                <div class="search-thumbnail-details">
                    <p>${el.name}
                    <a 
                    href='https://www.google.com/maps/search/?api=1&query=${el.location[0]},${el.location[1]}'
                    ><img src="location.png"/></a></p>
                    
                </div>
            </div>
    `
    })
    
}
fetchData()
