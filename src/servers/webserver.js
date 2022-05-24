module.exports = function(){
	const http = require("http");
	const fs = require('fs');
	return http.createServer((req,res)=>{
		var url = decodeURI(req.url).split(/[#?]/)[0]
		if(url == "/" || url == "/index"){
				file = './pages/index.html'
				fs.createReadStream(file).pipe(res)
		}else if(req.url.toString().endsWith(".js")){
			var file = "./assets/"+decodeURI(req.url)
			if(fs.existsSync(file)){
				res.setHeader("Content-Type", "text/javascript");
				var content = fs.readFileSync(file)
				res.end(content)
			}else{
				console.error(file," not exist")
				res.end();
			}
		}else{
			var file = "./assets/"+decodeURI(req.url)
			if(fs.existsSync(file)){
				fs.createReadStream(file).pipe(res)
			}else{
				console.error(file," not exist")
				res.end();
			}
		}
		
	})
}