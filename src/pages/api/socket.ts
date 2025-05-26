import { NextApiRequest, NextApiResponse } from 'next'
import { Server as IOServer } from 'socket.io'
import { Server as NetServer } from 'http'

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & { io?: IOServer }
  }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (res.socket.server.io) {
    return res.end()
  }

  const io = new IOServer(res.socket.server, {
    path: '/api/socket',
  })
  res.socket.server.io = io

  io.on('connection', socket => {
    console.log('🟢 클라이언트 연결:', socket.id)
    socket.on('disconnect', () => console.log('🔴 연결 끊김:', socket.id))
  })

  res.end()
}