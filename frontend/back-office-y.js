const genericName = document.getElementById('generic-name');
const tradeName = document.getElementById('trade-name');
const drugStrength = document.getElementById('strength');
const enterNewEntry = document.getElementById('entry-btn')
const productsDisplay =  document.getElementById('products-display');
const stockStat=  document.getElementById('stock-stat');
const pcategory = document.getElementById('category');
const route = document.getElementById('route');
const dialogMsg = document.getElementById("dialog-msg")

const confirmDeleteDialog = document.getElementById('confirm-delete-dialog');
const confirmDeleteButton =  document.getElementById('confirm-delete-btn')
console.log(route.value)

const personData = JSON.parse(localStorage.getItem("person-info")) || [];
const productToDelete = JSON.parse(localStorage.getItem("product-delete")) || [];
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
            drugCategory: pcategory.value,
            drugStockstatus: stockStat.value, 
            route:route.value,
            
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
            <li>
                <p>${el.genericName} ${el.drugStrength} <b>(${el.tradeName})</b> ${el.route} </p> 
                <button id='${el._id}' class="delete-edit" onclick="deleteDialog('${el.tradeName}')">  &#9932;  </button>
            </li>
        `
    })
}
getUserProducts()
//delete product function

const deleteDialog=(par)=>{
    const idto = event.target.id
    console.log(idto)
    productToDelete.unshift(idto)
    localStorage.setItem('product-delete', JSON.stringify(productToDelete))
    dialogMsg.textContent = `delete ${par}`
    confirmDeleteDialog.showModal()
}
//deleteDialog();
const deleteProduct = async(par)=>{
    const del = await fetch(`${window.location.origin}/deleteProduct/${par}`)
    const response = await del.json()
    console.log(response)
    
}



enterNewEntry.addEventListener('click', ()=>{
    if( genericName.value && tradeName.value && drugStrength){
        postNewEntry()
        //console.log(pcategory.value)
    }else{
        alert('write full details')
    }
    
    window.location.reload()
    
    
})

confirmDeleteButton.addEventListener("click", ()=>{
    window.location.reload()
    deleteProduct(productToDelete[0])
})


