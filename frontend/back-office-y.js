const genericName = document.getElementById('generic-name');
const tradeName = document.getElementById('trade-name');
const drugStrength = document.getElementById('strength');
const drugCategory = document.getElementById('category');
const drugStockstatus = document.getElementById('stock-status');
const enterNewEntry = document.getElementById('entry-btn')
const productsDisplay =  document.getElementById('products-display')

const personData = JSON.parse(localStorage.getItem("person-info")) || [];
const postNewEntry =async()=>{
    const post = await fetch(`${window.location.origin}/new-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genericName: genericName.value,
            tradeName: tradeName.value,
            drugStrength: drugStrength.value,
            drugCategory: drugCategory.value,
            drugStockstatus: drugStockstatus.value, 
            user_id: personData[0].user_id
        })
    })
    const response =  await post.json()
    console.log(response)
}


const getUserProducts = async()=>{
    const user_id= personData[0].user_id
    const getproducts = await fetch(`${window.location.origin}/getproducts/${user_id}`)
    const data = await getproducts.json()
    console.log(data)
    data.forEach((el)=>{
        productsDisplay.innerHTML +=`
            <li>${el.genericName} tradename ${el.tradeName}</li>
        `
    })
}
getUserProducts()
enterNewEntry.addEventListener('click', ()=>{
    postNewEntry()
    window.location.reload()
    
    
})
