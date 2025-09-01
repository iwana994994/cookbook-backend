import {Server} from "socket.io";

export const initializeSocket = (server) => {
    const io = new Server(server,
        {
            cors: {
                origin: "https://mobile-frontend-beryl.vercel.app",
                      methods: ["GET", "POST"],
                       credentials: true, 
                
            },
            transports: ["websocket", "polling"],
        }
    );
    const userSocketMap = new Map();
    const userActivityMap = new Map();


    io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (isValidToken(token)) {
    next();
    console.log("Token is valid 😍😍😍");
  } else {
    next(new Error("Unauthorized   😒😒😒"));
  }
}); 
    // user are connected
    io.on("connection", (socket) => {
       socket.on("user_connected", (userId) => {
           userSocketMap.set(userId, socket.id);
        userActivityMap.set(userId, "idle");
        console.log(`User ${userId} connected 😍😍😍`);
         io.emit("users_connected", userId);
       })
     
      socket.emit( "users_online", Array.from(userSocketMap.keys()));
      io.emit("activity", Array.from(userActivityMap.entries()));  

     
    //  user are disconnected
        socket.on("disconnect", () => {
            let disconnectedUserId
            
            for (const [userId, socketId] of userSocketMap) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSocketMap.delete(userId);
                 userActivityMap.delete(userId);
                    break;
                }
            }
        if (disconnectedUserId) {
            io.emit("disconnect", disconnectedUserId);
            console.log(`User ${disconnectedUserId} disconnected 👀`);
        }    
        });
        socket.on("connect_error", (err) => {
  console.error("Socket connect_error:    ", err);
});
socket.on("error", (err) => {
  console.error("Socket error:", err);
});


    }) 
}
