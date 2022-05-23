const session = ((window)=>{
	const observable = new EventTarget()
	const ws = new WebSocket(location.origin.replace(/https?/,"ws"))
	ws.onopen = ()=>{
		console.info('Connection etablished with the Server')
		var ev = new Event("open")
		observable.dispatchEvent(ev)
	}
	ws.onmessage = (msg)=>{
		msg = JSON.parse(msg.data)
		var ev = new Event("message")
		ev.message = msg
		observable.dispatchEvent(ev)
	}
	ws.onclose = ()=>{console.warn('Server Closed')}
	ws.onerror = (...error)=>{console.error(error)}
	function send(msg = {}){
		if(typeof msg == "string"){
			msg = {data:msg}
		}
		ws.send(JSON.stringify(msg))
	}
	return Object.assign(observable,{
		"#msg":{},
		set(key,value){
			this["#msg"][key] = value
		},
		get(key){
			return this["#msg"][key]
		},
		save(){
			send(this["#msg"])
			this.clear()
		},
		clear(){
			this["#msg"] = {}
		}
	});
})(window)

