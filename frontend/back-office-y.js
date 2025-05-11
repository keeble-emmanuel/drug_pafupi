const genericName = document.getElementById('generic-name');
const tradeName = document.getElementById('trade-name');
const drugStrength = document.getElementById('strength');
const drugCategory = document.getElementById('category');
const drugStockstatus = document.getElementById('stock-status');
const enterNewEntry = document.getElementById('entry-btn')
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

enterNewEntry.addEventListener('click', ()=>{
    postNewEntry()
    //alert('ee')
    
})
