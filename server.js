const http = require("http");
const fs = require('fs');
const ws = require('ws');
const {ObjectManager} = require("./ObjectManager");
const port = 8047;
const server = http.createServer((req,res)=>{
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
const wss = new ws.WebSocketServer({ server });

const OM = new ObjectManager
project = OM.set("projects",)
project.addEventListener('update',update)
const clients = new Map()
function update(ev){
	var name = ev.table+ev.prop.name
	clients.forEach((attrs,uuid)=>{
		attrs.wsv.has(name) && ws.send(`{"wsv":${name},"value":${ev.prop.value}}`)
	})
}
wss.on('connection', function connection(ws) {
	var attrsM = {
		"#uuid":null,
		set uuid(value){
			console.log(clients.has(value))
			if(clients.has(value)){
				var attrs = clients.get(value)
				for(attr in attrs){
					if(attr.startsWith('#'))continue
					if(attr == "uuid"){
						this["#uuid"] = attrs[attr]
						continue
					}else{
						this[attr] = attrs[attr]
					}
				}
			}
			this["#uuid"] = value
			clients.set(value,attrsM)
		},
		get uuid(){
			return this["#uuid"]
		},
		wsv:new Set(),
		ws
	}
	ws.on('message', function message(data) {
		console.log('received: %s', data);
		var msg = JSON.parse(data)
		var onMessage = require('./socket');
		var response = onMessage(msg,attrsM)||{}
		// console.info('unkown response %s',response)
		response = JSON.stringify(response)
		ws.send(response);
	});
});

server.listen(port);