import http from 'http'
import api from './api'

const server = http.createServer(api)

server.listen(6000, () => console.log('Server Started on port 6000'))
