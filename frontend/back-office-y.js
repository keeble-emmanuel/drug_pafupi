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
const notificationsDisplay =  document.getElementById('notifications-display');
const changePassword =  document.getElementById('change-password');
const oldPassword =  document.getElementById('current-password');
const newPassword =  document.getElementById('new-password');
const confirmPassword =  document.getElementById('confirm-password');
const loadingScreen = document.getElementById('loading-screen');
const completeScreen = document.getElementById('completeScreenContainer');
const uploadExcel = document.getElementById('upload-excel');
const searchWord = document.getElementById('search')

cancelUpdate.style.display = 'none'
let userProducts;
let product_id;
var userDetailArray =[];
var update = false;
let productToPromote;
let todele = []
var allproductData = []

const reg = new RegExp(`.*${searchWord.value}.*`, 'i')
console.log(reg)

const setInputsBlack =()=>{
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
}

const confirmDeleteDialog = document.getElementById('confirm-delete-dialog');
const confirmDeleteButton =  document.getElementById('confirm-delete-btn')
console.log(route.value)

const personData = JSON.parse(localStorage.getItem("person-info")) || [];
const userDetailLS = JSON.parse(localStorage.getItem("user-details")) || [];
const productToDelete = JSON.parse(localStorage.getItem("product-delete")) || [];
const productPromote = JSON.parse(localStorage.getItem("product-promote")) || [];
const personLocation = JSON.parse(localStorage.getItem("person-location")) || [];

//post location
const postLocation =async()=>{
    //loadingScreen.style.display = 'grid'
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
    //loadingScreen.style.display = 'none'
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
    postLocation()
    //window.open(nowurl)    
}
locationBtn.addEventListener('click', ()=>{
    if(navigator.geolocation){
        completeScreen.style.display = 'grid';
        const pos = navigator.geolocation.getCurrentPosition(showPosition);
        setTimeout(() => {
            completeScreen.style.display = 'none';      
        }, 2000);
       
    }else{
        console.log('please allow location')
    }
})
//get user details
const getUserDetails= async()=>{
    loadingScreen.style.display = 'grid'
    const dofetch = await fetch(`${window.location.origin}/get_user/${personData[0].user_id}`);
    const data = await dofetch.json();
    console.log(data)
    if(data.location.length == 0){
    notificationsDisplay.innerHTML +=`
        <li>visit the profile icon to submit your google map coordinates (location)</li>
    `  
    }
    userDetailArray= data
    
    if (userDetailLS.length>=1){
        userDetailLS.pop()
        userDetailLS.unshift(data);
    }else{
        userDetailLS.unshift(data);
    }
    
    localStorage.setItem('user-details', JSON.stringify(userDetailLS));
    userHeading.innerHTML=`<p>${userDetailLS[0].name}</p>`
    loadingScreen.style.display = 'none'    
}
getUserDetails();
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
    //setInputsBlack()
    
}
//post password change
const postPasswordChange =async()=>{
    loadingScreen.style.display  = 'grid'
    const post = await fetch(`${window.location.origin}/change-password`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newPassword: newPassword.value.trim(),
            oldPassword: oldPassword.value.trim(),
            user_id: personData[0].user_id
        })
    })
    const response =  await post.json()
    console.log(response)
    alert(`${response.data}`)
    loadingScreen.style.display = 'none'
}

//update post request
const postUpdateEntry =async(parameter)=>{
    
    const post = await fetch(`${window.location.origin}/update-product`,{
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
            expiryDate:expiryDate.value.trim(),
            price: price.value.trim(),
            user_id: personData[0].user_id,
            product_id: product_id


        })
    })
    const response =  await post.json()
    console.log(response)
    setInputsBlack();
    
}


//
const postPromoteProduct =async()=>{
    const post = await fetch(`${window.location.origin}/promote-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            promoPrice:newpricePromotion.value.trim(),
            productId: productPromote[0]
        })
    })
    const response =  await post.json()
    console.log(response)
}
//
const postDepromoteProduct =async()=>{
    const post = await fetch(`${window.location.origin}/depromote-product`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            
            productId: productPromote[0]
        })
    })
    const response =  await post.json()
    console.log(response)
}
//

const getUserProducts = async()=>{
    loadingScreen.style.display = 'grid'
    const user_id= personData[0].user_id
    const getproducts = await fetch(`${window.location.origin}/getproducts/${user_id}`)
    const data = await getproducts.json()
    allproductData =data
    loadingScreen.style.display = 'none'
    //return data
    
}
const filterFetchedproducts=(par)=>{
    userProducts = par;
    const productsDisplay = document.createElement('ol');
    productsDisplay.id = "products-thumbnail-i";
    productsDisplayD.textContent = '';
    console.log(par, 'o')
    const sortByKey = (arr, key) => {
        return [...arr].sort((a, b) => {
            const valA = a[key].toLowerCase(); 
            const valB = b[key].toLowerCase(); 
            if (valA < valB) {
            return -1;
            }
            if (valA > valB) {
            return 1;
            }
            return 0; 
        });
        };
    const sortedProducts = sortByKey(par, 'tradeName');
    const reg = new RegExp(`.*${searchWord.value}.*`, 'i')
    const fiteredData = sortedProducts.filter((el)=>
        reg.test(el.tradeName) || reg.test(el.genericName)
    )
    console.log(fiteredData, 'fil')
    fiteredData.forEach((el)=>{
        
        productsDisplay.innerHTML +=`
            <li>
                <p>${el.tradeName} ${el.dosageForm} ${el.drugStrength} @<b>MWK ${el.price?el.price: 'N/A'} </b></p> 
                <button id='${el.tradeName}' class="delete-edit" onclick="deleteDialog('${el._id}')"><i class="fa-solid fa-trash"></i></button>
                <button id='' class="delete-edit" onclick="editFunction('${el._id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                <button id='${el.price}' class="delete-edit" onclick="promoteFunction('${el._id}')"><i style='color:${el.promoted? 'blue': 'var(--foreground-2)'}'class="fa-solid fa-gift"></i></button>
            </li>
        `
    })
    
    productsDisplayD.appendChild(productsDisplay);
    //productsDisplayD.style.height = '60vh'
    //productsDisplayD.style.overflowY = 'auto'
    

}
const displayfilterFetchedproducts=()=>{

}
const hub=async()=>{
    await getUserProducts()
    await filterFetchedproducts(allproductData)
}
hub()

//delete product function
const deleteDialog=(par)=>{
    const idto = event.target.id
    if(productToDelete.length != 0){
        productToDelete.pop();
        productToDelete.unshift(par)
    }else{
        productToDelete.unshift(par)
    }
    
    localStorage.setItem('product-delete', JSON.stringify(productToDelete))
    var todp =userProducts.filter((el)=>{
        return el._id == par
    })
    dialogMsg.textContent = `delete ${todp[0].tradeName} ${todp[0].drugStrength} `
    confirmDeleteDialog.showModal()
}
//deleteDialog();
const deleteProduct = async(par)=>{
    const del = await fetch(`${window.location.origin}/deleteProduct/${par}`)
    const response = await del.json()
    //hub()   
}

//promoteFunction
const promoteFunction =(par)=>{
    var idOf = event.target.id
    if(productPromote.length >= 1){
        productPromote.pop()
        productPromote.unshift(par)
    }else{
       productPromote.unshift(par) 
    }
    localStorage.setItem('productPromote', JSON.stringify(productPromote));
    var todele = userProducts.filter((el)=>{
        return el._id == par;
    })
    console.log(todele)
    if(!todele[0].promoted){
        document.getElementById('promote-h3').textContent='Promote ' + todele[0].tradeName;
        document.getElementById('promotep').textContent= "old price MWK : "+todele[0].price;
        newpricePromotion.style.display ='inline'
        document.getElementById('promote-product').textContent= "promote"

    }else{
        document.getElementById('promote-h3').textContent='dePromote ' + todele[0].tradeName;
        document.getElementById('promotep').textContent= ""
        document.getElementById('promote-product').textContent= "depromote"
        document.getElementById('promoper').textContent = ''
        newpricePromotion.style.display ='none'
       
    }
    
    productPromote.unshift(par)
    
    productToPromote = par;
    document.getElementById('promote-div').style.display='block';
}


// edit entry function
const editFunction=(par)=>{
    cancelUpdate.style.display = 'inline'
    window.location.href = "#back-office"
    let productToEdit
    productToEdit=userProducts.filter((el)=>{
        return el._id.toLowerCase() == par
    })
    product_id = productToEdit[0]._id
    genericName.value= productToEdit[0].genericName;
    tradeName.value= productToEdit[0].tradeName;
    drugStrength.value= productToEdit[0].drugStrength
    pcategory.value= productToEdit[0].drugCategory
    stockStat.value= productToEdit[0].drugStockstatus
    route.value=productToEdit[0].route
    dosageForm.value= productToEdit[0].dosageForm ? productToEdit[0].dosageForm : 'tablet';
    //date formats
    const datefromserver = productToEdit[0].expiryDate;
    const formatdaate = String(datefromserver).substring(0, 10);
    expiryDate.value= formatdaate;
    //
    price.value= productToEdit[0].price?productToEdit[0].price: 100
    enterNewEntry.textContent = 'update'
    update = true;   
}
if(!update){
    enterNewEntry.textContent = 'Enter Product';
    cancelUpdate.style.display = 'none'
}
//
enterNewEntry.addEventListener('click', async()=>{
    if(!update){
        
        if( genericName.value && tradeName.value && drugStrength.value && expiryDate.value && dosageForm.value && route.value){
            await postNewEntry()
            await hub()
            setInputsBlack()
        }else{
            alert('not complete')
        }
        
    }else{
        if( genericName.value && tradeName.value && drugStrength.value && expiryDate.value && dosageForm.value && route.value){
        await postUpdateEntry();
        await hub()
        setInputsBlack()
        }else{
            alert('not complete')
        }
        update = false;
        
    }
    hub()
    update = false
    //window.location.reload()
    
    
})

confirmDeleteButton.addEventListener("click", ()=>{
    deleteProduct(productToDelete[0]);
    hub()
    
})
//cancel update
cancelUpdate.addEventListener('click', async()=>{
    
    await setInputsBlack();
    update = false;
})

//keyup in promotion
newpricePromotion.addEventListener('keyup', ()=>{
     var todele = userProducts.filter((el)=>{
        return el._id == productPromote[0];
    })
    var percnt = parseFloat(newpricePromotion.value)/parseFloat(todele[0].price)*100
    document.getElementById('promoper').textContent= percnt == NaN? '0': parseInt(percnt) + '%'

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
    getUserProducts()
})
//promote button in dialog
document.getElementById('promote-product').addEventListener('click', ()=>{
    producttobepromotedornot = userProducts.filter((el)=>{
        return el._id == productPromote[0]
    })
    console.log(producttobepromotedornot, "eee")
    if(producttobepromotedornot[0].promoted == true){
        postDepromoteProduct()  
    }
    else{
        postPromoteProduct()
    }
    document.getElementById('promote-div').style.display='none';
    hub()
})

//change password
changePassword.addEventListener('click', ()=>{
    if(newPassword.value != confirmPassword.value){
        alert('your passwords dont much')
    }else{
        postPasswordChange()
    }
})
document.getElementById('file-excelx').addEventListener('change', ()=>{
    if(!document.getElementById('file-excelx').value == ''){
    document.getElementById('warning-before-submission').style.display='block'
}
})

uploadExcel.addEventListener('click', async(e)=>{
    e.preventDefault()
    const filex = document.getElementById('file-excelx');
    const file = filex.files[0]
    const formData = new FormData();
    formData.append('excelFile', file)
    try{
        const fet = await fetch(`${window.location.origin}/${personData[0].user_id}/upload`, {
        method: 'POST',
        body: formData

        })
       
        const res = await fet.json()
        console.log(res)
        if (res.message == 'success'){
            completeScreen.style.display = 'grid';
            setTimeout(() => {
                completeScreen.style.display = 'none';      
            }, 2000);
        }else{
            alert(res.error)
        }
        
    }catch(err){
        console.error(err)
    }finally{
        hub()
    }
     
})

search.addEventListener('keyup', ()=>{
    filterFetchedproducts(allproductData)
})
notificationsDisplay.innerHTML +=`
        <li>Visit the promotion page regulary to check products that other pharmacies have promoted</li>
    ` 
