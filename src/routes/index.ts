import express from 'express'
import defaultNetwork from '../api/services/defaultRoute/defaultNetwork'
import credentialsRoutes from './credentials.route'
import connectionsRoutes from './connections.route'

export default function routes (server) {
    server.use('/v1/', defaultNetwork)
    server.use('/v1/credentials', credentialsRoutes)
    server.use('/v1/connections', connectionsRoutes)
}
