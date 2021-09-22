/** imports */
import db from './src/database/index'
import morgan from 'morgan'
import express from 'express'
import router from './src/routes'
import { CredentialJSON, Credentials } from './src/models'
import mysql from 'mysql'
import cors from 'cors'
import credentialsService from './src/api/services/credentials/credentials.service'
import { ConnectionJSON, Connections } from './src/models/connections/connections.model'
import { Connector } from './src/database/connector'
import { GVRequestJSON } from 'src/models/requests/request.model'

/** declarations */
const server = express()
const http = require('http').createServer(server)
const io = require('socket.io')(http)

/** connect to remote dev database */
db("mongodb+srv://m001-student:ch3ch0425!@sandbox.sa0qy.mongodb.net/Sandbox?retryWrites=true&w=majority")

/** Socket.io connection */
io.on('connection', socket => { 
    console.log(`---- client with host -->  ${socket.handshake.headers.host} connected to this socket ----`)

    // if we are not using this, erase it please ...
    socket.on("openMySQLConnection", (data:CredentialJSON) => {

        let mysqlConfig = {
            host : data.host,
            user : data.user,
            password : data.password 
        }

        //console.log(`open mysql connection data --> ${JSON.stringify(data, undefined, 2)}`)
        let pool = mysql.createPool({...mysqlConfig, connectionLimit: 10}) 

        /** check conneciton and save it into the mongo db in case is successfull */
        pool.getConnection(async (err, connection) => {
            if (err) {
                socket.emit('openMySQLConnection', {state: 'error'})
                throw new Error("Error with database connection :(")
            }
            
            let credentialData = data
            let credential = new Credentials(credentialData)
            await credentialsService.create(credential)

            socket.emit('openMySQLConnection', {state: 'connected'})

        })

    })

    /** form open connection button */
    socket.on("openConnection", async (data:CredentialJSON) => {

        console.log('---- open connection -----')

        switch (data.db_engine) {
            case "MySQL":
                await Connector.mySQLConnection(data).then(connectorResponse => {
                    socket.emit('openConnection', {state: connectorResponse})
                }).catch(error => {
                    socket.emit('openConnection', {state: error})
                })
                break;

            case "PostgreSQL":
                await Connector.postgreSQLConnection(data).then(connectorResponse => {
                    socket.emit('openConnection', {state: connectorResponse})
                }).catch(error => {
                    socket.emit('openConnection', {state: error})
                })
                break;
        
            default:
                break;
        }

    })

    /** form test connection button */
    socket.on("testConnection", async (data: CredentialJSON) => {

        console.log('---- test connection -----')

        console.log(data.db_engine)

        switch (data.db_engine) {
            case "MySQL":
                await Connector.testMySQLConnection(data).then(connectorResponse => {
                    socket.emit('testConnection', {state: connectorResponse})
                } ).catch(error => {
                    console.log('error with test database connection ', error)
                    socket.emit('testConnection', {state: error})
                })
                break;

            case "PostgreSQL":
                await Connector.testPostgreSQLConnection(data).then(connectorResponse => {
                    console.log(connectorResponse)
                    socket.emit('testConnection', {state: connectorResponse})
                } ).catch(error => {
                    console.log('error with test database connection ', error)
                    socket.emit('testConnection', {state: error})
                })

                break;
        
            default:
                break;
        }
        
    })

    /** GV component queries */
    socket.on("mainNodesRequest", async( data: GVRequestJSON) => {
        console.log('---- Main Nodes Request connection -----')

        switch (data.credentials.db_engine) {
            case "MySQL":
                // await Connector.mySQLConnection(data).then(connectorResponse => {
                //     socket.emit('openConnection', {state: connectorResponse})
                // }).catch(error => {
                //     socket.emit('openConnection', {state: error})
                // })
                break;

            case "PostgreSQL":
                await Connector.postgreSQLConnectionMainNodes(data.credentials).then(connectorResponse => {
                    //console.log('CONNECTOR RESPONSE -->  ', connectorResponse)
                    socket.emit('mainNodesRequest', {data: connectorResponse})
                }).catch(error => {
                    console.log(error)
                    socket.emit('mainNodesRequest', {data: null})
                })
                break;
        
            default:
                break;
        }
    })
});

/** server settings */
server.set('port', process.env.PORT || 3000)
server.use(morgan('dev'))
server.use(express.urlencoded({extended:false}))
server.use(express.json())
server.use(cors())

/** router and middleware */
router(server)

/** server listening */
http.listen(3000, () => {
    console.log(`--------- server listen on port ${server.get('port')} ------- `)    
});