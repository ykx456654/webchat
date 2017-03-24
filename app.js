var http = require('http');
var querystring = require('querystring');
var bodyParser = require('body-parser')
var express = require('express');
var request = require('request-json');
var client = request.createClient('http://test.api.yishengzhan.cn');
app = express()
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json())
app.use(express.static(__dirname + '/dist'))
app.get('/',function(req, res){
	res.sendfile("./dist/index.html");
})


// app.post('/api',function(req, res){
//     // console.log(req.body)
//     var data = JSON.stringify(req.body)
//     var options = {
//         host:'test.api.yishengzhan.cn',
//         path:'/',
//         method:'POST',
//         headers:{
//             'Content-Type': 'application/json',
//             'Content-Length': data.length
//         }
//     }
//     var resData = ''
//     var reqs = http.request(options,function(serverRes){
//         // console.log(1)
//         serverRes.setEncoding('utf8')
//         serverRes.on('data',function(chunk){
//              console.log("body: " + chunk);
//             resData+=chunk
//         })
//         serverRes.on('end',function(chunk){
//             console.log("body: " + chunk);
//         })
//     })
//     reqs.on('error',function(message){
//         console.log('error'+message)
//     })
//     // console.log(data)
//     reqs.write(data)
//     reqs.end()
//     return res.send(resData)
// })


app.post('/api',function(req,res){
  var data = req.body
  client.post('/',data,function(error,response,body){
    return (function(){
      console.log(JSON.stringify(body))
      res.send(body)
    })()
  })
})

app.listen(3030,function(){
  console.log('start server 3030')
})