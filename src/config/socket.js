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

    }) 
}
