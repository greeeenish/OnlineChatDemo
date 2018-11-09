let socket = io()

//连接服务器
socket.on('connect', function(){
    console.log('客户端连接成功')
})

let list = document.getElementById('list'),
    input = document.getElementById('input'),
    sendBtn = document.getElementById('sendBtn');

//发送消息
sendBtn.onclick = send
input.onkeydown = function(event){
    if(event.keyCode==13){
        send()
    }
}
function send(){
    let value = input.value
    if(value){
        socket.emit('message', value)
        input.value = ''
    }else{
        alert('输入内容不能为空')
    }
}

//私聊
list.onclick = function(event){
    privateChat(event)
}
function privateChat(event){
    if(event.target.className=='user'){
        let user = event.target.innerHTML
        input.value = `@${user}`
    }
    
}

//接受服务器的消息
socket.on('message', function(data){
    let li = document.createElement('li')
    li.className = 'list-group-item'
    li.innerHTML = `<p>
        <span class="user">${data.user}</span>  ${data.date}
    </p>
    <p>${data.content}</p>
    `
    
    list.appendChild(li);
    list.scrollTop = list.scrollHeight;     // 将聊天区域的滚动条设置到最新内容的位置

})