const port = 8047;
const data = {

}
require("./src/servers/websocket")(
	require("./src/servers/webserver")(),
	data
)
.listen(port);
/*
const ObM = new ObjectManager
project = ObM.set("projects",)
project.addEventListener('update',update)
function update(ev){
	var name = ev.table+ev.prop.name
	clients.forEach((attrs,uuid)=>{
		attrs.wsv.has(name) && ws.send(`{"wsv":${name},"value":${ev.prop.value}}`)
	})
}
*/