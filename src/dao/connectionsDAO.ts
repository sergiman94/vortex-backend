import {MongoClient, Collection} from "mongodb"
import { connection } from "mongoose"
import { ConnectionJSON } from "../models/connections/connections.model"

let connections: Collection<any>

export default class ConnectionDAO {
    
    /** injected mongo db collection connection from server index */
    static async injectDB (conn: MongoClient) {
        try {
            connections = await conn.db(process.env.MAIN_DB).collection("connections")
        } catch (error) {
            console.log(`There was a problem connection to the connectionsDAO ${error}`)
        }
    }

    static async addConnection(connectionData: ConnectionJSON) {
        try {
            await connections.insertOne(connectionData)
            return {success: true, data: connectionData}
        } catch (error) {
            if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
                return { error: "A Connection with the given data already exists." }
            }
            console.error(`Error occurred while adding new connection, ${error}.`)
            return { error: error }
        }
    }

    static async getConnection(connectionKey) {
        try {
            let connection = await connections.findOne({key: connectionKey})
            return connection
        } catch (error) {
            console.log(`Error getting connection --> ${error}`)
            return {error:`Error getting connection --> ${error}`}
        }
    }

    static async getConnections() {
        try {
            let connectionsList = await connections.find().toArray()
            return connectionsList
        } catch (error) {
            console.log(`Error listing connections --> ${error}`)
            let connectionsList = []
            return connectionsList
        }
    }

    static async updateConnection (connectionKey, connection: ConnectionJSON) {
        try {
            const updateResponse =  await connections.updateOne(
                {key: connectionKey},
                {$set: {
                    credentials: connection.credentials,
                    open: connection.open,
                    db_engine: connection.db_engine
                }} 
            )

            if (updateResponse.matchedCount === 0) {
                throw new Error("Couldn't find a match for this credential");
            }

            return updateResponse
                
        } catch (error) {
            console.log('error updating conneciton', error)
            return {error: `Error updating conneciton --> ${error}`}
        }
    }

    static async deleteConnection (connectionKey) {
        try {
            await connections.deleteOne({key: connectionKey})

            if (! (await this.getConnection(connectionKey))) {
                return {success: `Connection ${connectionKey} successfully deleted`}
            } else {
                return {error: `Can not delete connection ${connectionKey}`}
            }
        } catch (error) {
            console.log(`Error deleting connection --> ${error}`)
            return {error: `Can not delete connection ${connectionKey} error ${error}`}
        }
    }
}