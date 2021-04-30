import http from 'http'
import { config, logger } from './util'
import api from './api'

const server = http.createServer(api)

server.listen(config.PORT, () => logger.info(`Server Started on port ${config.PORT}`))
