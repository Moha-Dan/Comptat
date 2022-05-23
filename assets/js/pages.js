const service = {
	connect(msg){
		var rights = msg.rights
		// console.log(msg.uuid,sessionStorage.getItem('uuid'))
		if(msg.uuid)
			sessionStorage.setItem('uuid',msg.uuid)
		localStorage.setItem('connected',"PDG")
		// document.querySelector('a[href*="#login"]').remove()
		// location.assign(`#${rights}`)
		session.set('service',"dashboard")
		//session.set('rights',rights)
		session.save()
		console.log("connected ",msg.connected)
	},
	dashboard(msg){
		var menu = document.querySelector('#menu')
		var menus = msg.menu
		menu.innerHTML = menus.join('')
		findWSV(menu)
	}
}
function move(page){
	if(page.length && !components.has(`component-${page}`)){
		session.set("page",page)
		session.save()
	}
}
function normalize(hash){
	return hash.slice(1)
}
const WSVs = new Map()
function findWSV(parent = document.body){
	parent.querySelectorAll('[data-wsvalue]').forEach(x=>{
		var valueName = x.dataset.wsvalue;
		session.set("wsv",valueName)
		session.save()
		WSVs.set(valueName,x)
	})
}
session.addEventListener('open',()=>{
	var uuid = sessionStorage.getItem('uuid')
	if(uuid){
		session.set("service","connect")
		session.set("uuid",uuid)
		session.save()
	}
	var search = location.hash
	move(normalize(search))
})
window.addEventListener('hashchange',()=>{
	var search = location.hash
	move(normalize(search))
})
components = new Set()
session.addEventListener('message',(ev)=>{
	var message = ev.message;
	if(message.file){
		var div = document.createElement('div')
		div.innerHTML = message.file
		div.id = `component-${message.components}`
		components.add(div.id)
		var parent = document.querySelector(message.selector||"body")
		parent.appendChild(div)
		findWSV(parent)
		Haiku.update()
	}else if(message.service){
		service[message.service](message)
	}else if(message.wsv){
		WSVs.get(message.wsv).innerHTML = message.value
	}else{
		console.error('unkown object %s',msg)
	}
})