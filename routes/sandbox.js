// const axios = require("axios");

// const payload = {
//     auth: {
//         rpcuser: "wefgiwebfg23br",
//         rpcpass: "efwioun23ourb"
//     },
//     method: "getblockchaininfo",
//     // params:[
//     //   "1"
//     // ],
// };
// let blockResponse = axios.post("http://localhost:18443", payload)
// .then(res => {
//     console.log(res);
// })
// .catch((err) => {
//     console.log(err);
// })


var http = require("http");

async function generateBlock(blocksToGenerate){
    var options = {
        "method": "POST",
        "port": "18443",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Basic d2VmZ2l3ZWJmZzIzYnI6ZWZ3aW91bjIzb3VyYg==",
            "cache-control": "no-cache",
            "Postman-Token": "363b3275-ca2a-4e96-9336-d8d4db9f4397"
        }
    };
    
    var req = http.request(options, function (res) {
        var chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    
    req.write(JSON.stringify({
        method: 'generate',
        params: [blocksToGenerate]
    }));
    req.end();

}