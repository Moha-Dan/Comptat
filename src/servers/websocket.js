const clients = new Map()

class Client{
	#ws
	#data
	constructor(ws,data){
		this.#ws = ws
		this.#data = data
	}
	#uuid = null
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
		clients.set(value,this)
	}
	get uuid(){
		return this["#uuid"]
	}
	wsv = new Set()
	query(qc,data){
		try{
			return this.#data.query(qc,data)
		}catch{
			return null
		}
	}
	data = {}
}

module.exports = function(server,data){
	const ws = require('ws');
	const wss = new ws.WebSocketServer({ server });
	wss.on('connection', function connection(ws) {
		var client = new Client(ws,data)
		ws.on('message', function message(_msg) {
			console.log('received: %s', _msg);
			var msg = JSON.parse(_msg)
			var onMessage = require('../sokects/socket');
			var response = onMessage(msg,client)||{}
			// console.info('unkown response %s',response)
			response = JSON.stringify(response)
			ws.send(response);
		});
	});
	return server
}