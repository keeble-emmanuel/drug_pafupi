const productsThumbnailDiv = document.getElementById('products-thumbnail-div')

const fetchData =async()=>{
    const fetched = await fetch(`${window.location.origin}/market`)
    const results = await fetched.json();
    console.log(results)
    results.forEach((el)=>{
        productsThumbnailDiv.innerHTML += `
        <div class="products-thumbnail">
                <img class="search-thumbnail" src="istockphoto-1419246808-612x612.jpg"/>
                <div class="search-thumbnail-details">
                    <p>${el.user_id.name}</p>
                    <p>${el.tradeName}</p>
                </div>
            </div>
    `
    })
    
}
fetchData()
