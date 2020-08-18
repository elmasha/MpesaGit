const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const e = require('express');
const app = express();
const port = 4224;


//routes

app.get('/', (req, res)=>{


res.send("Hello Elmasha")

})


///----Access Token ---
app.get('/access_token',access,(req,res)=>{

    res.status(200).json({access_token: req.access_token})

})

///----Stk Push ---//
app.get('/stk', access ,(res,req)=>{


    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
    let auth = "Bearer "+ req.access_token

    const dateNow = new Date()
    let timestamp = dateNow.getFullYear() +""+""+dateNow.getMonth()+""+""+dateNow.getDate()
    +""+""+ dateNow.getHours()+""+""+dateNow.getMinutes()+""+""+dateNow.getSeconds();

    const password = new Buffer.from('174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'  +timestamp).toString('base64');


    request(
        {
            url:endpoint,
            method:"POST",
            headers:{

                "Authorization": auth
                
            },json:{
                "BusinessShortCode":"174379",
                "Password" :password,
                "Timestamp":timestamp,
                "TransactionType":"CustomerBillOnline",
                "Amount":"1",
                "PartyA":"254746291229",
                "PartyB":"174379",
                "PhoneNumber":"254746291229",
                "CallBackURL":"https://mkoba.herokuapp.com:4111/callbacks",
                "AccountReference":"Elmasha TEST",
                "TransactionDesc":"Lipa na Mpesa",
            }

        },
       function(error,response,body){

            if(error){

                console.log(error);

            }

                res.status(200).json(body);
        

        })

});




///-----B2c -----///
app.get('/b2c', access , (res,req)=>{


    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/processrequest"
    let auth = "Bearer "+ req.access_token

    request(
        {
            url:endpoint,
            method :"POST",
            headers:{
            "Authorization": auth
                
            },json:{
                "InitiatorName":"testapi481",
                "SecurityCredential":"IeLYriOxTaityG/uhB+74NIiZW8blxi5dC89CQRW2pliMYPb36n5E08NT+5fUXk60JHFNi5csrN9dFpE7zbswV9FHf3qhZuNEbuUt1ix6rPk7fIQXe3KQL1BOe0boYd4+nwcv283KzxJ+42A9WdH4j+5RlY7lTeGCzHztw1S1DHcUHGUIfsDHnff3DdjgNHGVlRVW3KuEzO/BfLLx8bDPxa4RNGoFaFaDPj6I235wrze0pZVtz9Nsxdu9ixzqD0boZClM5qX4SKwarsDAyPU09yi7OECPW0mwXs2CPUrychIHn8aTvN3ZxQBAHT1WqtIZsj92HAs9UCRm91AgyiO9A==",
                "CommabID":"BusinessPayBill",
                "Amount":"1",
                "PartyA":"600481",
                "PartyB":"254708374149",
                "Remarks":"Salary Payment",
                "QueueTimeoutUrl":"http://TimeOut_Url",
                "ResultURl":"http://Result_Url",
                "Occasion":"MpesaApi001",

            }

        
        },function(error,response,body){

            if(error){

            }else{

                res.status(200).json(body)
            }

        }
    )


})





//----Register Url ------///
app.get('/Register_urls',access,(res,req)=>{

    let endpoint = "http://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer "+ req.access_token

    request(
        {
            url:endpoint,
            method :"POST",
            headers :{
                "Authorization": auth
            },
            json:{
      "ShortCode":"600481",
      "ResponseType":"Complete",
      "ConfirmationURL":"http://ip_address:port/confirmation",
      "ValidationURL":"http://ip_address:port/validation_url"
            }
        },
        function(error,response,body){
            if(error) {console.log(error)
            }else{
            res.status(200).json(body)
            }
        }
    )



})






function access(res,req,next){

    const endpoint ="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    const auth = new Buffer.from('K49Zle6LPHOGv7avuuw61MfIIWzai9gS:FQCGD4QOIFM4j8HJ').toString('base64');

    request(
    {
        url:endpoint,
        headers:{
            "Authorization": "Basic " + auth
        }

    },
    (error,response,body)=>{

        if(error){
            console.log(error);
        }else{
        
            res.access_token = JSON.parse(body).access_token
            next()
        
        }
            
    }
    )


}




//-- listen
app.listen(4224,(error,live)=>{

if(error){

}else{

    console.log("Server running on port",port)

}


});