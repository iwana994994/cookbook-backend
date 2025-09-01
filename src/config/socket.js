import {Server} from "socket.io";
import { verifyToken } from "@clerk/clerk-sdk-node";

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

// check if token is valid SOCKET.IO IS REQUIRING TOKEN ALWAYS!!!
 // ✅ Clerk token validation
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No token provided"));

      const { payload } = await verifyToken(token, {
    
        secretKey: process.env.CLERK_JWT_KEY, // vidi u Clerk dashboardu
      });
      console.log("Token payload:   🥰  ", payload);
      
      socket.user = payload.sub; // user id iz Clorka
      console.log("Token valid 😍 for user:", socket.user);
      next();
    } catch (err) {
      console.error("Token validation failed", err);
      next(new Error("Unauthorized 😒"));
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
  console.error("Socket connect_error:  ⚔  ", err);
});
socket.on("error", (err) => {
  console.error("Socket error:  ⚔⚔⚔ ", err);
});


    }) 
}
