const express = require("express")
const app = express()

app.use(express.static(__dirname));

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', function(socket){
    console.log('服务端连接成功')

    let username
    let socketObj = {}
   
    socket.on('message', function(msg){
        if(username){
            let input = msg.match(/^@(\w+)/)
            if(input){
                let private_user = input[1]
                let private_content = input['input']
                let toPrivate = socketObj[private_user]
      
                if(toPrivate){
                    toPrivate.send({
                        user: username,
                        content: private_content,
                        date: new Date().toLocaleString() 
                    })
                }
            }else{
                io.emit('message', {
                    user: username,
                    content: msg,
                    date: new Date().toLocaleString()
                })
            }
        }else{
            username = msg
            socket.broadcast.emit('message',{
                user: '系统消息',
                content: username+'加入了聊天',
                date: new Date().toLocaleString()
            })
            socketObj[username] = socket
        }
    })
})

server.listen(3000)     //这里要用server去监听端口，不能用app.listen去监听，否则会找不到socket.io.js文件
