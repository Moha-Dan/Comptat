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
			for(var attr in attrs){
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
	insert(table,obj,role=null){
		if(!this.#data.entities.has(table))return false
		var t = this.#data.entities.get(table)
		console.log(t.roles)
		if(t.roles && t.roles.includes(role)){
			console.log("step2 true")
			return this.#data.insert(table,obj)
		}
		return false
	}
	remakeQuery(...queries){
		queries.forEach(query=>{
			if(this.wsv.has(query)){
				var value = this.query(query,this.data)
				var msg = {wsv:query,value}
				this.#ws.send(JSON.stringify(msg))
				console.log(query)
			}
		})
	}
	data = {}
}

module.exports = function(server,data){
	const ws = require('ws');
	const wss = new ws.WebSocketServer({ server });
	const clients = new Set()
	wss.on('connection', function connection(ws) {
		var client = new Client(ws,data)
		clients.add(client)
		ws.on('message', function message(_msg) {
			// console.log('received: %s', _msg);
			var msg = JSON.parse(_msg)
			var onMessage = require('../sokects/socket');
			var response = onMessage(msg,client)||{}
			// console.info('unkown response %s',response)
			response = JSON.stringify(response)
			ws.send(response);
		});
		ws.on("close",()=>{
			clients.delete(client)
		})
		data.manager.addEventListener('insert',(e)=>{
			var t = e.table
			var q = data.queriesUsed.get(t)
			if(q){
				clients.forEach(c=>c.remakeQuery(...q))
			}
		})
	});
	return server
}