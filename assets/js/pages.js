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
	},
	sendForm(form){
		var inputs = form.querySelectorAll('input:not([type=submit],[type=button]),textarea,select')
		var values = {}
		inputs.forEach(x=>{
			var value = x.checked||x.value||x.selectedOptions||x.textContent
			values[x.name] = value
		})
		console.log(values)
		session.set("table",form.getAttribute('table'))
		var origin = [...document.querySelectorAll("[data-title]")].find(x=>[...x.querySelectorAll("a[href]")].find(x=>x.href==location.href)).dataset.title 
		session.set("origin",origin)
		session.set("form",values)
		session.save()
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
		if(globalThis.Haiku){
			Haiku.update()
		}else{
			var target = document.querySelector(location.hash)
			if(target){
				target.open = true
				globalThis.dialog = target
			}
		}
	}else if(message.service){
		service[message.service](message)
	}else if(message.wsv){
		WSVs.get(message.wsv).innerHTML = message.value
	}else{
		console.error('unkown object %s',JSON.stringify(message))
	}
})