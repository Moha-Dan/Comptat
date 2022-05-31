const fs = require('fs');
const service = require('./services');
function onMessage(msg,ws){
	if(msg.page){
		var file = "./components/"+decodeURI(msg.page)+".html"
		if(fs.existsSync(file)){
			var file = fs.readFileSync(file,{encoding:'utf8', flag:'r'})
			var components = msg.page
			return {file,components}
		}
	}else if(msg.service){
		return service[msg.service](msg,ws)
	}else if(msg.wsv){
		ws.wsv.add(msg.wsv)
		var value = ws.query(msg.wsv,ws.data)
		msg = {wsv:msg.wsv,value}
		return msg
	}else if(msg.form){
		return service.insert(msg,ws)
	}else{
		console.error('unkown object %s',msg)
		return {}
	}
}
module.exports = onMessage
