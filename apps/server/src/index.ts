import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  // ...
})

const PORT = process.env.PORT || 8080

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
