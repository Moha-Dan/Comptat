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
		msg = {wsv:msg.wsv,value:0}
		return msg
	}else{
		console.error('unkown object %s',msg)
		return {}
	}
}
module.exports = onMessage
