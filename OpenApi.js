
require("dotenv").config();
LostArk_Api = process.env.LOSTARK_API_KEY;

ancientRelicsId = 6882701;
rareRelicsId = 6882704;
orehaRelicsId = 6885708;
targetStoneId = 6861011;

async function getData(url="", itemID="",data = {}) {
    
    const response = await fetch(url+itemID, {
        method: "GET",
        headers: {
            "accpet": "application/json",
            "authorization": "bearer " + LostArk_Api,
        }
    })

    return response.json();
};

async function getPrice(itemID, data={}) {
    
    await getData("https://developer-lostark.game.onstove.com/markets/items/", itemID).then((data) => {
        itemName = data[0].Name;
        
        var today = new Date();
    
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
    
        var dayString = year + '-' + month + '-' + day;
    
        for(i = 0; i < data[0].Stats.length;i++){
            if(data[0].Stats[i].Date == dayString){
                // console.log(data[0].Stats[i].Date);
                // console.log(data[0].Stats[i].AvgPrice);
                itemPrice = data[0].Stats[i].AvgPrice;
            }
            
        }
        itemBundle = data[0].BundleCount;
    })

    let value = {Name: itemName, Price: itemPrice, Bundle: itemBundle};
    return value;
    
}

async function postData(url="", data = {}) {
    const response = await fetch(url+data, {
        method: "POST",
        headers: {
            "accpet": "application/json",
            "authorization": "bearer " + LostArk_Api,
        }
    })

    return response.json();
};

// itemID = ancientRelicsId;
// getPrice(itemID).then((itemValue) => {
//     console.log(itemValue.Name + ': ' + itemValue.Price + ' / ' + itemValue.Bundle);
// });


// itemID = rareRelicsId;
// getPrice(itemID).then((itemValue) => {
//     console.log(itemValue.Name + ': ' + itemValue.Price + ' / ' + itemValue.Bundle);
// });

// itemID = orehaRelicsId;
// getPrice(itemID).then((itemValue) => {
//     console.log(itemValue.Name + ': ' + itemValue.Price + ' / ' + itemValue.Bundle);
// });

// itemID = targetStoneId;
// getPrice(itemID).then((itemValue) => {
//     console.log(itemValue.Name + ': ' + itemValue.Price + ' / ' + itemValue.Bundle);
// });
