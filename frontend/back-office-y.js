const genericName = document.getElementById('generic-name');
const tradeName = document.getElementById('trade-name');
const drugStrength = document.getElementById('strength');
const enterNewEntry = document.getElementById('entry-btn')
const productsDisplayD =  document.getElementById('products-display-div');
const stockStat=  document.getElementById('stock-stat');
const pcategory = document.getElementById('category');
const price =  document.getElementById('price');
const expiryDate =  document.getElementById('expiry');
const dosageForm = document.getElementById('dosage-form');
const route = document.getElementById('route');
const dialogMsg = document.getElementById("dialog-msg");
const locationBtn = document.getElementById('submit-location');
const accBtn =  document.getElementById('accounts');
const closeDeleteDialog = document.getElementById('confirm-close-dialog');
const userHeading = document.getElementById('user-heading');
const newpricePromotion = document.getElementById('new_price_input');
const cancelUpdate = document.getElementById('cancel-update');

cancelUpdate.style.display = 'none'
let userProducts;
let product_id;
var userDetailArray =[];
var update = false;
let productToPromote;


const confirmDeleteDialog = document.getElementById('confirm-delete-dialog');
const confirmDeleteButton =  document.getElementById('confirm-delete-btn')
console.log(route.value)

const personData = JSON.parse(localStorage.getItem("person-info")) || [];
const userDetailLS = JSON.parse(localStorage.getItem("user-details")) || [];
const productToDelete = JSON.parse(localStorage.getItem("product-delete")) || [];
const productPromote = JSON.parse(localStorage.getItem("product-promote")) || [];
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
//post change sign credentials
const postChangeSignIn = ()=>{

}
//get user details
const getUserDetails= async()=>{
    const dofetch = await fetch(`${window.location.origin}/get_user/${personData[0].user_id}`);
    const data = await dofetch.json()
    
    if (userDetailLS.length>=1){
        userDetailLS.pop()
        userDetailLS.unshift(data);
    }else{
        userDetailLS.unshift(data);
    }
    
    localStorage.setItem('user-details', JSON.stringify(userDetailLS));
    userHeading.innerHTML=`<p>${userDetailLS[0].name}</p>`
    
}
getUserDetails()
//post new drug
const postNewEntry =async()=>{
    const post = await fetch(`${window.location.origin}/new-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            genericName: genericName.value.trim().toLowerCase(),
            tradeName: tradeName.value.trim().toUpperCase(),
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
    const productsDisplay = document.createElement('ul');
    productsDisplay.id = "products-thumbnail-i";
    productsDisplayD.textContent = '';
    console.log(data, 'o')
    data.forEach((el)=>{
        
        productsDisplay.innerHTML +=`
            <li>
                <p>${el.tradeName} ${el.dosageForm} ${el.drugStrength} ${el._id} @<b>MWK ${el.price?el.price: 'N/A'} </b></p> 
                <button id='${el.tradeName}' class="delete-edit" onclick="deleteDialog('${el._id}')"><img src="delete.svg"/></button>
                <button id='' class="delete-edit" onclick="editFunction('${el._id}')"><img src="edit.svg"/></button>
                <button id='${el.price}' class="delete-edit" onclick="promoteFunction('${el._id}')"><img src="gift.svg"/></button>
            </li>
        `
    })
    productsDisplayD.appendChild(productsDisplay);
    //cancelUpdate.style.display = 'none'
}
getUserProducts()
//delete product function

const deleteDialog=(par)=>{
    const idto = event.target.id
    //console.log(event.target.id, "feef")
    if(productToDelete.length != 0){
        productToDelete.pop();
        productToDelete.unshift(par)
    }
    productToDelete.unshift(par)
    localStorage.setItem('product-delete', JSON.stringify(productToDelete))
    var todp =userProducts.filter((el)=>{
        return el.id= par
    })
    dialogMsg.textContent = `delete ${todp[0].tradeName}`
    confirmDeleteDialog.showModal()
}
//deleteDialog();
const deleteProduct = async(par)=>{
    const del = await fetch(`${window.location.origin}/deleteProduct/${par}`)
    const response = await del.json()
    console.log(response)
    
}

//promoteFunction
const promoteFunction =(par)=>{
    var idOf = event.target.id
    if(productPromote.length >= 1){
        productPromote.pop()
        productPromote.unshift(par)
    }
    var todele = userProducts.filter((el)=>{
        return el._id == par;
    })
    document.getElementById('promote-h3').textContent='Promote ' + todele[0].tradeName;
    document.getElementById('promotep').textContent= "old price MWK : "+todele[0].price;
    productPromote.unshift(par)
    localStorage.setItem('productPromote', JSON.stringify(productPromote));
    productToPromote = par;
    document.getElementById('promote-div').style.display='block';
}


// edit entry function
const editFunction=(par)=>{
    getUserProducts()
    cancelUpdate.style.display = 'inline'
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
if(!update){
    enterNewEntry.textContent = 'Enter Product';
    cancelUpdate.style.display = 'none'
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
        if( genericName.value && tradeName.value && drugStrength.value && expiryDate.value && dosageForm.value && route.value){
        postUpdateEntry()
        }else{
            alert('not complete')
        }
        update = false;
        window.location.reload()
    }
    getUserProducts()
     update = false
    //window.location.reload()
    
    
})

confirmDeleteButton.addEventListener("click", ()=>{
    //window.location.reload()
    getUserProducts()
    deleteProduct(productToDelete[0])
})
//cancel update
cancelUpdate.addEventListener('click', ()=>{
    update = false;
    genericName.value= '';
    tradeName.value= '';
    drugStrength.value= ''
    pcategory.value= ''
    stockStat.value= ''
    route.value=''
    dosageForm.value= ''
    expiryDate.value=''
    price.value= ''
    cancelUpdate.style.display='none'
    enterNewEntry.textContent = 'Enter Product'

})

//keyup in promotion
newpricePromotion.addEventListener('keyup', ()=>{
    console.log(parseFloat(newpricePromotion.value))
    console.log(userProducts);
    var todele = userProducts.filter((el)=>{
        return el._id == productPromote[0]
    })
    console.log(todele)
    var percnt = parseFloat(newpricePromotion.value)/parseFloat(todele[0].price)*100
    console.log(percnt)
    document.getElementById('promoper').textContent= percnt == NaN? '0': percnt + '%'

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

document.getElementById('cancel-promotion').addEventListener('click', ()=>{
   document.getElementById('promote-div').style.display='none';
})

confirmDeleteDialog.addEventListener('click', ()=>{
    confirmDeleteDialog.close()
})



