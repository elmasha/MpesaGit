const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const e = require('express');
const app = express();
const port = 4111;


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

    let dateNow = new Date()
    const timestamp = dateNow.getFullYear() +""+""+dateNow.getMonth()+""+""+dateNow.getDate()
    +""+""+ dateNow.getHours()+""+""+dateNow.getMinutes()+"i"+"i"+dateNow.getSeconds();

    const password = new Buffer('174379'+'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'+timestamp).toString('base64');


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
                "PartyA":"25446291229",
                "PartyB":"174379",
                "PhoneNumber":"25446291229",
                "CallBackURL":"http://ip:1212/callbacks",
                "AccountReference":"Elmasha TEST",
                "TransactionDesc":"Lipa na Mpesa",
            }

        },
        function(error,response,body){

            if(error){

                console.log(error)

            }else{

                res.status(200).json(body)

            }


        }
    )


})

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
                "InitiatorName":"",
                "SecurityCredential":"",
                "CommabID":"",
                "Amount":"",
                "PartyA":"",
                "PartyB":"",
                "Remarks":"",
                "QueueTimeoutUrl":"http://TimeOut_Url",
                "ResultURl":"http://Result_Url",
                "Occasion":"",

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
app.listen(4111,(error,live)=>{

if(error){

}else{

    console.log("Server running on port",port)

}


});