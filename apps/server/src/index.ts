import { createServer } from 'http'
import { Server } from 'socket.io'
import Game from './managers/game'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

export const rooms = new Map<string, Game>()

io.on('connection', (socket) => {
  console.log('a user connected', socket.id)

  // Join Room
  socket.on('join-room', (roomId: string, name: string) => {
    // validate roomId and name else throw error
    if (!roomId) {
      socket.emit('error', 'Room ID is required')
      return
    }

    if (!name) {
      socket.emit('error', 'Name is required')
      return
    }

    socket.join(roomId)

    // Create Room if not exists else add player to room
    if (rooms.has(roomId)) {
      // get game
      const game = rooms.get(roomId)

      if (!game) {
        return socket.emit('error', 'Game not found')
      }

      // add player to game
      game.addPlayer(socket.id, name, socket)
    } else {
      // create game
      const game = new Game(roomId, io, socket.id)
      rooms.set(roomId, game)

      // add player to game
      game.addPlayer(socket.id, name, socket)
    }
  })
})

const PORT = process.env.PORT || 8080

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
