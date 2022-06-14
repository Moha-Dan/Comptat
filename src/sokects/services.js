const { randomUUID } = require('crypto');
var apps = require('../../config/apps.json');

function createCard(name,app){
	var badge = ""
	if(app.value){
		badge = `<div class="counter" data-wsvalue="${app.value}" >...</div>`
	}
	var btn = ""
	if(app.href){
		btn = `<a class="btn" href="#${app.href}" />${app.button}</a>`
	}
	var description = ""
	if(app.description){
		description = `<p>${app.description}</p>`
	}
	return `<div class="card" data-title="${name}" >
	<h2>${name}</h2>
	${badge}
	${description}
	${btn}
	</div>`
}
var config = require('../../config/config.json')
const service = {
	connect(msg,ws){
		var user = {username:msg.username,password:msg.password}
		var users = ws.getTable('Users')
		var reslt = users.find(user)
		if(reslt){
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
		}else if(config.admin.username == user.username && config.admin.password == user.password){
			console.log("admin")
			return {connected:true,service:"connect",rights:"ADM",uuid}
		}
	},
	dashboard(msg,ws){
		var menu = []
		for(appName in apps){
			var app = apps[appName]
			if(! app.rights.includes(ws.rights))
				continue;
			var _file = createCard(appName,app)
			menu.push(_file)
		}
		return {service:"dashboard",menu}
	},
	insert(msg,ws){
		var d = msg.form
		d.author ??= ws.data.id
		var p = msg.origin.charAt(0).toUpperCase()+msg.origin.slice(1)
		var t = msg.table

		var success = false

		if(apps[p] && apps[p].rights && apps[p].rights.includes(ws.rights)){
			success = ws.insert(t,d,ws.rights)
			console.log("step1 true")
		}

		var msg = {success}
		console.log(msg)
		return msg
	},
	// adminconnect(msg,ws){
	// 	var users = ws.getTable('Users')
	// 	var reslt = users.find({username:msg.username,password:msg.password})
	// 	if(!reslt){
	// 		users.push()
	// 		return this.connect(msg,ws)
	// 	}
	// }
}
module.exports = service