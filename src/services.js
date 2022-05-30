const { randomUUID } = require('crypto');
function createCard(name,app){
	var badge = ""
	if(app.value){
		badge = `<div class="counter" data-wsvalue="${app.value}" >...</div>`
	}
	var btn = ""
	if(app.href){
		btn = `<a class="btn" onclick="location.assign('#${app.href}')" />${app.button}</a>`
	}
	var description = ""
	if(app.description){
		description = `<p>${app.description}</p>`
	}
	return `<div class="card">
	<h2>${name}</h2>
	${badge}
	${description}
	${btn}
	</div>`
}
const service = {
	connect(msg,ws){
		ws.uuid = msg.uuid
		ws.data.id = 0
		if(ws.uuid != msg.uuid){
			return {connected:true,service:"connect",rights,uuid}
		}else{
			ws.client = msg
			ws.client.connected = true;
			var rights = "PDG"
			ws.rights = rights
			var uuid = randomUUID()
			ws.uuid = uuid
			return {connected:true,service:"connect",rights,uuid}
		}
	},
	dashboard(msg,ws){
		var apps = require('./apps.json')
		var menu = []
		for(appName in apps){
			var app = apps[appName]
			if(! app.rights.includes(ws.rights))
				continue;
			var _file = createCard(appName,app)
			menu.push(_file)
		}
		return {service:"dashboard",menu}
	}
}
module.exports = service