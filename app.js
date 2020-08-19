const express = require('express')
const request = require('request')
const bodyParser = require('body-parser');
const e = require('express');
const http = require('http');
const https = require('https');
const app = express();
const apiCallFromRequest = require('./Request')
const apiCallFromNode = require('./nodeCalls')
const port =4224;

const urls = {
    'stk': "",
    "simulate": "",
    "b2c": "",
    "base_url": ""
}
const maker = access_token()
const headers = {
    "Authorization": "Bearer " + maker
}




//routes
app.get('/', (req, res)=>{



res.send("Hello Elmasha Mpesa APi")



})




///----Access Token ---
app.get('/access_token',access,(req,res)=>{

    res.status(200).json({access_token: req.access_token})

})

///----Stk Push ---//
app.get('/stk', access ,(req,res)=>{

    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
     auth = "Bearer "+ req.access_token
     let _shortCode = '174379'
     let _passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'


     const timeStamp = (new Date()).toISOString().replace(/[^0-9]/g, '').slice(0, -3);
     const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString('base64');

    request(
        {
            url:endpoint,
            method:"POST",
            headers:{

                "Authorization": auth
                
            },
    
        json:{
    
                    "BusinessShortCode": "174379",
                    "Password":password,
                    "Timestamp":timeStamp,
                    "TransactionType": "CustomerPayBillOnline",
                    "Amount": "1",
                    "PartyA": "254746291229",
                    "PartyB": "174379",
                    "PhoneNumber": "254746291229",
                    "CallBackURL": "https://192.168.42.98:4224/Callbacks",
                    "AccountReference": " Elmasha TEST",
                    "TransactionDesc": "Lipa na Mpesa"

            }

        },
       function(error,response,body){

            if(error){

                console.log(error);

            }else if(response == 404){

                console.log("Error Something went wrong..")


            }else{
                res.status(200).json(body)
                console.log(body)
            }

        })

});

app.get('/Callbacks',(req,res)=>{
    
console.log('.......... STK Callback ..................')

console.log(JSON.stringify(req.body))

})


///-----B2c -----///
app.get('/b2c', access , (req,res)=>{


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
                "SecurityCredential":"IeLYriOxTaityG/uhB+74NIiZW8blxi5dC89CQRW2pliMYPb36n5E08NT+5fUXk60JHFNi5csrN9dFpE7zbswV9FHf3qhZuNEbuUt1ix6rPk7fIQXe3KQL1BOe0boYd4+nwcv283KzxJ+42A9WdH4j+5RlY7lTeGCzHztw1S1DHcUHGUIfsDHnff3DdjgNHGVlRVW3KuEzO/BfLLx8bDPxa4RNGoFaFaDPj6I235wrze0pZVtz9Nsxdu9ixzqD0boZClM5qX4SKwarsDAyPU09yi7OECPW0mwXs2CPUrychIHn8aTvN3ZxQBAHT1WqtIZsj92HAs9UCRm91AgyiO9A== ",
                "CommandID":"BusinessPayment",
                "Amount":"23",
                "PartyA":"600481",
                "PartyB":"254708374149",
                "Remarks":" Salary Payment",
                "QueueTimeOutURL":"https://mkoba.herokuapp.com/timeout_url",
                "ResultURL":"https://mkoba.herokuapp.com/result_url",
                "Occasion":"MpesaApi001 "

            }
        
        },
        function(error,response,body){
            if(error){
                console.log(error);
            }

                res.status(200).json(body)

        }
    )


})


app.post('/timeout_url', (req, resp) => {
    console.log('.......... Timeout ..................')
    console.log(req.body)
})

app.post('/result_url', (req, resp) => {
    console.log('.......... Results..................')
    console.log(req.body)
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


//----------------Reverse ------///

app.get('/reverse', access, (req, res) => {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request',
        auth = 'Bearer ' + req.access_token

        request({
            method: "POST",
            url: url,
            headers: {
                "Authorization": auth
            },
            json: {
                "Initiator": "apitest342",
                "SecurityCredential":"Q9KEnwDV/V1LmUrZHNunN40AwAw30jHMfpdTACiV9j+JofwZu0G5qrcPzxul+6nocE++U6ghFEL0E/5z/JNTWZ/pD9oAxCxOik/98IYPp+elSMMO/c/370Joh2XwkYCO5Za9dytVmlapmha5JzanJrqtFX8Vez5nDBC4LEjmgwa/+5MvL+WEBzjV4I6GNeP6hz23J+H43TjTTboeyg8JluL9myaGz68dWM7dCyd5/1QY0BqEiQSQF/W6UrXbOcK9Ac65V0+1+ptQJvreQznAosCjyUjACj35e890toDeq37RFeinM3++VFJqeD5bf5mx5FoJI/Ps0MlydwEeMo/InA==",
                "CommandID":"TransactionReversal",
                "TransactionID":"NLJ11HAY8V",
                "Amount":"100",
                "ReceiverParty":"601342",
                "RecieverIdentifierType":"11",
                "ResultURL":"http://197.248.86.122:801/reverse_result_url",
                "QueueTimeOutURL":"http://197.248.86.122:801/reverse_timeout_url",
                "Remarks":"Wrong Num",
                "Occasion":"sent wrongly"
            }
        },
            function (error, response, body) {
                if (error) {
                    console.log(error)
                }
                else {
                    res.status(200).json(body)
                }
            }
        )
})

app.post('/reverse_result_url', (req, res) => {
    console.log("--------------------Reverse Result -----------------")
    console.log(JSON.stringify(req.body.Result.ResultParameters))
})

app.post('/reverse_timeout_url', (req, res) => {
    console.log("-------------------- Reverse Timeout -----------------")
    console.log(req.body)
})






//////-----------Account Balance-----/////

app.get('/balance', access, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "Initiator": "apitest342",
                "SecurityCredential": "Q9KEnwDV/V1LmUrZHNunN40AwAw30jHMfpdTACiV9j+JofwZu0G5qrcPzxul+6nocE++U6ghFEL0E/5z/JNTWZ/pD9oAxCxOik/98IYPp+elSMMO/c/370Joh2XwkYCO5Za9dytVmlapmha5JzanJrqtFX8Vez5nDBC4LEjmgwa/+5MvL+WEBzjV4I6GNeP6hz23J+H43TjTTboeyg8JluL9myaGz68dWM7dCyd5/1QY0BqEiQSQF/W6UrXbOcK9Ac65V0+1+ptQJvreQznAosCjyUjACj35e890toDeq37RFeinM3++VFJqeD5bf5mx5FoJI/Ps0MlydwEeMo/InA==",
                "CommandID": "AccountBalance",
                "PartyA": "601342",
                "IdentifierType": "4",
                "Remarks": "bal",
                "QueueTimeOutURL": "http://197.248.86.122:801/bal_timeout",
                "ResultURL": "http://197.248.86.122:801/bal_result"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                resp.status(200).json(body)
            }
        }
    )
})






function access_token() {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from('K49Zle6LPHOGv7avuuw61MfIIWzai9gS:FQCGD4QOIFM4j8HJ').toString('base64');

    request(
        {
            url: url,
            headers: {
                "Authorization": "Basic " + auth
            }
        },
        (error, response, body) => {
            if (error) {
                console.log(error)
            }
            else {
                // let resp = 
               return JSON.parse(body).access_token
            }
        }
    )
}






//-- listen
app.listen(4224,function(error,live){

if(error){


}else{  

    console.log('Server running on port',port)

}


});