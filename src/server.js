import http from "http";
import WebSocket from "ws";
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))

app.get("/", (req,res) => {res.render("home")});

const listen = () => console.log(`RUNNING IN ws://localhost:${PORT}`);

const server = http.createServer(app);
const wss = new WebSocket.Server(
    {server}
);

const sockets = []; // 소켓들을 전부 모아두는 리스트

wss.on("connection",(stb) => { // 브라우저가 소켓과 통신할때
    sockets.push(stb); // 소켓 리스트에 추가
    stb["nickname"] = "Anon"; // 닉네임 미리 지어주기
    stb.on("message", (data) => { // 메시지가 왔을때
        const parsedData = JSON.parse(data); // JSON을 복호화

        switch (parsedData.type) { // 타입 분류
            case "new_message": // 메시지 보내기
                sockets.forEach(aSocket => aSocket.send(`${stb.nickname}: ${parsedData.payload.toString()}`));
                break;
            case "nickname": // 닉네임 바꾸기
                stb["nickname"] = parsedData.payload;
                break;
        }

    });
});

server.listen(PORT,listen)

