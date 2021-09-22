const express = require('express')
import { Router } from 'express'
import { Credentials } from '../../src/models/credentials/credentials.model'
import credentialsService  from '../api/services/credentials/credentials.service'
import { success, errorResponse } from '../api/utils/utils'
const router: Router = express.Router()

/** list credentials */
router.get('/', async (req, res) => {
    try {
        let credentials = await credentialsService.list()
        success(res, credentials, 200)
    } catch (error) {
        console.log(`Error with credentials list service --> ${error}`)
        errorResponse(req, res,`Error with credentials list service`, 500, error)
    }
})

/** create credential */
router.post('/', async (req, res) => {
    try {
        let credential = new Credentials(req.body)
        let credentialCreated = await credentialsService.create(credential)
        success(res, credentialCreated, 200)
    } catch (error) {
        console.log(`Error with credentials create service ${error}`)
        errorResponse(req, res,`Error with credentials create service`, 500, error)
    }
    
})

/** get credential by id */
router.get('/:id', async (req, res) => {
    try {
        let credentialKey = req.params.id || ''
        let credential = await credentialsService.get(credentialKey)
        success(res, credential, 200)
    } catch (error) {
        console.log(`Error with credentials get service ${error}`)
        errorResponse(req, res,`Error with credentials get service`, 500, error)
    }
})


/** update credential by id */
router.put('/:id', async (req, res) => {
    try {
        let credentialKey = req.params.id || ''
        let credential = new Credentials(req.body)
        let credentialUpdated = await credentialsService.update(credentialKey, credential)
        success(res, credentialUpdated, 200)
    } catch (error) {
        console.log(`Error with credentials update service ${error}`)
        errorResponse(req, res,`Error with credentials update service`, 500, error)
    }
})

/** delete credential by id */
router.delete ('/:id', async (req, res) => {
    try {
        let credentialKey = req.params.id || ''
        let credentialDeleted = await credentialsService.delete(credentialKey)
        success(res, credentialDeleted, 200)
    } catch (error) {
        console.log(`Error with credentials delete service ${error}`)
        errorResponse(req, res,`Error with credentials delete service`, 500, error)
    }
})

export default router 