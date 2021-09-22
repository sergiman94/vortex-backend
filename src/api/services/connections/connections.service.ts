import ConnectionDAO from "../../../dao/connectionsDAO";
import { ConnectionJSON, Connections } from '../../../models/connections/connections.model'
import {Service} from '../service.interface'


class ConnectionService implements Service<ConnectionJSON> {

    getTotal(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    create(item: ConnectionJSON): Promise<void> {
        return this.save(item)
    }

    async update(key: string, item: ConnectionJSON): Promise<any> {
        let connectionUpdated = await ConnectionDAO.updateConnection(key, item)
        return connectionUpdated
    }

    patch?(changes: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async save(item: ConnectionJSON): Promise<any> {
        const connection = new Connections(item)
        const insertResult = await ConnectionDAO.addConnection(item)

        if (!insertResult.success) {
            throw new Error("Can't insert connection to database");
        }

        let connectionCreated = await ConnectionDAO.getConnection(connection)

        return Promise.resolve(connectionCreated).catch(error => console.log(error))
    }

    async get(key: any): Promise<any> {
        let connection = await ConnectionDAO.getConnection(key)
        return connection
    }

    async list(query?: any) {
        const connections = await ConnectionDAO.getConnections()
        return connections
    }

    async delete(connectionKey: any): Promise<any> {
        let connectionDeleted = await ConnectionDAO.deleteConnection(connectionKey)
        return connectionDeleted
    }

}

const connectionsService = new ConnectionService()
export default connectionsService