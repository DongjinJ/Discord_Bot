// import fetch from "node-fetch";
const fetch = require('fetch');
const axios = require('axios');


async function getData(url="", itemID="", token="",data = {}) {
    // console.log(url)
    // console.log(itemID)
    // console.log(token)
    
    // const response = await fetch(url+itemID, {
    //     method: "GET",
    //     headers: {
    //         "accpet": "application/json",
    //         "authorization": "bearer " + token,
    //     }
    // })

    const response = await axios.get(url+itemID, {
        headers: {
            "accpet": "application/json",
            "authorization": "bearer " + token,
        }
    })
    // console.log(response);
    return response.data;
};

async function getPrice(itemID, token, data={}) {

    await getData("https://developer-lostark.game.onstove.com/markets/items/", itemID, token).then((data) => {
        // console.log(data);
        itemName = data[0].Name;
        
        var today = new Date();
    
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
    
        var dayString = year + '-' + month + '-' + day;
    
        for(i = 0; i < data[0].Stats.length;i++){
            if(data[0].Stats[i].Date == dayString){
                console.log(data[0].Stats[i].Date);
                console.log(data[0].Stats[i].AvgPrice);
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

// module.exports = {
//     getPrice
// }
async function orehaTotal(){
    const ancientRelicsId = 6882701;
    const rareRelicsId = 6882704;
    const orehaRelicsId = 6885708;
    const targetStoneId = 6861011;
    LostArk_Api="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAzMDAyMzQifQ.dQv88Cpuo9iir719wpUtCUV44uA07uN2d4zegl_MNPWiOfpbVDiNmaZAyy90gdDwBsknZKrdcn26imEQLlDnZg-SgC3VrXuqf2CRyT5G2EUhldNuTDtpZi_RSIYWYCXAhAAM-Ng8eaXQSPws-R36dyw9Ld1CDGkEE1Dih-rZEYoIQ-AQfTLs4we0wSG9TW7y5iW4yrJ5WtaOba3mxCH1chz5WQzJPe4ZFoSktHoMUCmMug0bhJXGLbCVrwlmCbsI1BRWc9SzqAn5rX0PKjeSEkF5mzHK9HXBT6ps9DdSIcS3l214nViDt_JwsOG-l4R95wsT0opR8qeJyRkJjWKq7w"
    getPrice(ancientRelicsId, LostArk_Api).then((itemValue) => {
        ancientRelicsData = itemValue;
        
    });
    getPrice(rareRelicsId, LostArk_Api).then((itemValue) => {
        rareRelicsData = itemValue;
        
    });
    getPrice(orehaRelicsId, LostArk_Api).then((itemValue) => {
        orehaRelicsData = itemValue;
        
    });
    getPrice(targetStoneId, LostArk_Api).then((itemValue) => {
        targetStoneData = itemValue;
        
    });
    let value = {ancientRelicsData, rareRelicsData, orehaRelicsData, targetStoneData};

    return value;
    
}
orehaTotal().then((returnValue) => {
    console.log(returnValue.ancientRelicsData.Name + ' / ' + returnValue.ancientRelicsData.Price)
    console.log(returnValue.rareRelicsData.Name + ' / ' + returnValue.rareRelicsData.Price)
    console.log(returnValue.orehaRelicsData.Name + ' / ' + returnValue.orehaRelicsData.Price)
    console.log(returnValue.targetStoneData.Name + ' / ' + returnValue.targetStoneData.Price)
})