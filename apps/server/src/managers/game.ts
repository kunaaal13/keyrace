import { Server, Socket } from 'socket.io'
import getParagraph from '../utils/para'
import { rooms } from '..'

interface Player {
  id: string
  name: string
  score: number
}

// Socket refers to the socket.io client i.e the user who is connected to the server while io refers to the socket.io server

class Game {
  id: string
  status: 'waiting' | 'playing' | 'finished'
  players: Player[]
  io: Server
  hostId: string
  paragraph: string

  constructor(id: string, io: Server, hostId: string) {
    this.id = id
    this.status = 'waiting'
    this.players = []
    this.io = io
    this.hostId = hostId
    this.paragraph = ''
  }

  handleDisconnect(socket: Socket) {
    // If host left
    if (socket.id === this.hostId) {
      this.players = this.players.filter((player) => player.id !== socket.id)

      // if lobby is empty, delete the game
      if (this.players.length === 0) {
        rooms.delete(this.id)
      } else {
        this.hostId = this.players[0].id
        this.io.to(this.id).emit('new-host', this.hostId)
      }
    }

    socket.leave(this.id)
    this.players = this.players.filter((player) => player.id !== socket.id)
    this.io.to(this.id).emit('player-left', socket.id)
  }

  initListeners(socket: Socket) {
    // Start game listener
    socket.on('start-game', async () => {
      // if game is not waiting, throw error
      if (this.status === 'playing') {
        socket.emit('error', 'Game has already started')
        return
      }

      // If host is not starting the game, throw error
      if (this.hostId !== socket.id) {
        socket.emit('error', 'Only host can start the game')
        return
      }

      this.players.forEach((player) => {
        player.score = 0
      })

      this.paragraph = await getParagraph()

      // Send Player list to all players
      this.io.to(this.id).emit('players', this.players)

      // Set game status to playing
      this.status = 'playing'

      // Send game started event to all players
      this.io.to(this.id).emit('game-started', this.paragraph)

      setTimeout(() => {
        this.status = 'finished'

        // Find the winner
        let winner = this.players[0]
        this.players.forEach((player) => {
          if (player.score > winner.score) {
            winner = player
          }
        })

        this.io.to(this.id).emit('game-finished', winner)
        // this.io.to(this.id).emit('players', this.players)
      }, 1000 * 60)
    })

    // Player typing listener
    socket.on('player-typed', (typed: string) => {
      // if game is not playing, throw error
      if (this.status !== 'playing') {
        socket.emit('error', 'Game has not started yet')
        return
      }

      const splitParagraph = this.paragraph.split(' ')
      const splitTyped = typed.split(' ')

      let score = 0

      for (let i = 0; i < splitTyped.length; i++) {
        if (splitParagraph[i] === splitTyped[i]) {
          score++
        }
      }

      // Update player score
      const player = this.players.find((player) => player.id === socket.id)

      if (player) {
        player.score = score
      }

      // Send updated player list to all players
      this.io.to(this.id).emit('player-score', {
        id: socket.id,
        score: score * 10,
      })
    })

    // Player left listener
    socket.on('leave', () => {
      this.handleDisconnect(socket)
    })

    // Disconnect listener
    socket.on('disconnect', () => {
      this.handleDisconnect(socket)
    })
  }

  addPlayer(id: string, name: string, socket: Socket) {
    // if game is not waiting, throw error
    if (this.status !== 'waiting') {
      socket.emit('error', 'Game has already started')
      return
    }

    this.players.push({ id, name, score: 0 })

    // Send player joined event to all players
    this.io.to(this.id).emit('player-joined', { id, name, score: 0 })
    this.io.to(this.id).emit('players', this.players)

    // Notify player that he has joined the game and send players list and host name
    socket.emit('new-host', this.hostId)

    // init listeners
    this.initListeners(socket)
  }
}

export default Game
