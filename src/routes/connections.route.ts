const express = require('express')
import {Router} from 'express'
import connectionsService from '../../src/api/services/connections/connections.service'
import {Connections} from '../../src/models/connections/connections.model'
import {success, errorResponse} from '../api/utils/utils'
const router: Router = express.Router()

/** list connection */
router.get('/', async (req, res) => {
    try {
        let connections = await connectionsService.list()
        success(res, connections, 200)
    } catch (error) {
        console.log(`Error with connections list service --> ${error}`)
        errorResponse(req, res,`Error with connections list service`, 500, error)
    }
})

/** create connection */
router.post('/', async (req, res) => {
    try {
        let connection = new Connections(req.body)
        let connectionCreated = await connectionsService.create(connection)
        success(res, connectionCreated, 200)
    } catch (error) {
        console.log(`Error with connections create service ${error}`)
        errorResponse(req, res,`Error with connections create service`, 500, error)
    }
})

/** get connection by id */
router.get('/:id', async (req, res) => {
    try {
        let connectionKey = req.params.id || ''
        let connection = await connectionsService.get(connectionKey)
        success(res, connection, 200)
    } catch (error) {
        console.log(`Error with connections get service ${error}`)
        errorResponse(req, res,`Error with connections get service`, 500, error)
    }
})

/** update connection by id*/
router.put('/:id', async (req, res) => {
    try {
        let connectionKey = req.params.id || ''
        let connection = new Connections(req.body)
        let connectionUpdated = await connectionsService.update(connectionKey, connection)
        success(res, connectionUpdated, 200)
    } catch (error) {
        console.log(`Error with connections update service ${error}`)
        errorResponse(req, res,`Error with connections update service`, 500, error)
    }
})

/** delete connection by id*/
router.delete('/:id', async (req, res) => {
    try {
        let connectionKey = req.params.id || ''
        let connectionDeleted = await connectionsService.delete(connectionKey)
        success(res, connectionDeleted, 200)
    } catch (error) {
        console.log(`Error with connections delete service ${error}`)
        errorResponse(req, res,`Error with connections delete service`, 500, error)
    }
})

export default router