const genericName = document.getElementById('generic-name');
const tradeName = document.getElementById('trade-name');
const drugStrength = document.getElementById('strength');
const enterNewEntry = document.getElementById('entry-btn')
const productsDisplay =  document.getElementById('products-display');
const stockStat=  document.getElementById('stock-stat');
const pcategory = document.getElementById('category');
const price =  document.getElementById('price');
const expiryDate =  document.getElementById('expiry');
const dosageForm = document.getElementById('dosage-form');
const route = document.getElementById('route');
const dialogMsg = document.getElementById("dialog-msg");
const locationBtn = document.getElementById('submit-location');
const accBtn =  document.getElementById('accounts')

let userProducts;
let product_id
var update = false;

const confirmDeleteDialog = document.getElementById('confirm-delete-dialog');
const confirmDeleteButton =  document.getElementById('confirm-delete-btn')
console.log(route.value)

const personData = JSON.parse(localStorage.getItem("person-info")) || [];
const productToDelete = JSON.parse(localStorage.getItem("product-delete")) || [];
const personLocation = JSON.parse(localStorage.getItem("person-location")) || [];

//post location
//console.log(personLocation[0].lat);

const postLocation =async()=>{
    const postit = await fetch(`${window.location.origin}/update-location`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: personData[0].user_id,
            locationOfUser: [personLocation[0].lat, personLocation[0].long]
            
        })
    })
    const response =  await postit.json()
    console.log(response);
    if(response.data = 'updated'){
        alert('updated')
    }else{
        alert('not succefull')
    }
}
//
//postLocation()
function showPosition(position) {
    const longt = position.coords.longitude;
    const lati = position.coords.latitude;
    const loc = {
        lat: lati,
        long:longt
    }
    personLocation.unshift(loc);
    localStorage.setItem('person-location', JSON.stringify(personLocation));
    const nowurl=`https://www.google.com/maps/search/?api=1&query=${lati},${longt}`

    let latlon = position.coords.latitude + "," + position.coords.longitude;

    let img_url = `https://maps.googleapis.com/maps/api/staticmap?center=
    "+${latlon}+"&zoom=14&size=400x300&sensor=false&key=YOUR_KEY`;
    postLocation()
    //window.open(nowurl)

    
}
locationBtn.addEventListener('click', ()=>{
    
    if(navigator.geolocation){
        const pos = navigator.geolocation.getCurrentPosition(showPosition)
       
    }else{
        console.log('please allow location')
    }
})


//post new drug
const postNewEntry =async()=>{
    const post = await fetch(`${window.location.origin}/new-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genericName: genericName.value.trim(),
            tradeName: tradeName.value.trim(),
            drugStrength: drugStrength.value.trim(),
            drugCategory: pcategory.value.trim(),
            drugStockstatus: stockStat.value.trim(), 
            route:route.value.trim(),
            dosageForm: dosageForm.value.trim(),
            expiryDate:expiryDate.value,
            price: price.value.trim(),
            user_id: personData[0].user_id
        })
    })
    const response =  await post.json()
    console.log(response)
}
//update post request
const postUpdateEntry =async(parameter)=>{
    const post = await fetch(`${window.location.origin}/update-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genericName: genericName.value.trim(),
            tradeName: tradeName.value.trim(),
            drugStrength: drugStrength.value.trim(),
            drugCategory: pcategory.value.trim(),
            drugStockstatus: stockStat.value.trim(), 
            route:route.value.trim(),
            dosageForm: dosageForm.value.trim(),
            expiryDate:expiryDate.value.trim(),
            price: price.value.trim(),
            user_id: personData[0].user_id,
            product_id: product_id


        })
    })
    const response =  await post.json()
    console.log(response)
}


//

const getUserProducts = async()=>{
    const user_id= personData[0].user_id
    const getproducts = await fetch(`${window.location.origin}/getproducts/${user_id}`)
    const data = await getproducts.json()
    userProducts = data;
    console.log(data)
    data.forEach((el)=>{
        
        productsDisplay.innerHTML +=`
            <li>
                <p>${el.tradeName} ${el.drugStrength} @<b>MWK ${el.price?el.price: 'N/A'} </b></p> 
                <button id='${el._id}' class="delete-edit" onclick="deleteDialog('${el.tradeName}')">  &#9932;  </button>
                <button id='' class="back-office-y-btn" onclick="editFunction('${el._id}')">edit</button>
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
// edit entry function
const editFunction=(par)=>{
    
    window.location.href = "#back-office"
    userProducts=userProducts.filter((el)=>{
        return el._id.toLowerCase() == par
    })
    console.log(userProducts);
    product_id = userProducts[0]._id
    genericName.value= userProducts[0].genericName;
    tradeName.value= userProducts[0].tradeName;
    drugStrength.value= userProducts[0].drugStrength
    pcategory.value= userProducts[0].drugCategory
    stockStat.value= userProducts[0].drugStockstatus
    route.value=userProducts[0].route
    dosageForm.value= userProducts[0].dosageForm ? userProducts[0].dosageForm : 'tablet'
    expiryDate.value=userProducts[0].expiryDate ? userProducts[0].expiryDate: '2025-12-12'
    price.value= userProducts[0].price?userProducts[0].price: 100
    console.log(userProducts);
    enterNewEntry.textContent = 'update'

    update = true;
    
    

}
//
enterNewEntry.addEventListener('click', ()=>{
    if(!update){
        if( genericName.value && tradeName.value && drugStrength.value && expiryDate.value && dosageForm.value && route.value){
        postNewEntry()
        
        }else{
            alert('not complete')
        }
        
    }else{
        postUpdateEntry()
        update = false
    }
    
    window.location.reload()
    
    
})

confirmDeleteButton.addEventListener("click", ()=>{
    window.location.reload()
    deleteProduct(productToDelete[0])
})

accBtn.addEventListener('click', ()=>{
    document.getElementById('man-acc-div').style.display='block'
    document.getElementById('man-acc-div').style.top='15vh'
    document.getElementById('accounts').style.display='none'
})

document.getElementById('close-man-acc').addEventListener('click', ()=>{
    document.getElementById('man-acc-div').style.top='-15vh';
    document.getElementById('man-acc-div').style.display='none';
    document.getElementById('accounts').style.display='block'
})
