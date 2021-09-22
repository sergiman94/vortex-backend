//import db from 'mongoose'
import {MongoClient} from 'mongodb'
import ConnectionDAO from '../dao/connectionsDAO'
import CredentialsDAO from '../dao/credentialsDAO'

//db.Promise = global.Promise

export default async function connect(url) {
    // let configs = {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     dbName: "test",
    // }

    // await db.connect(url,configs)
    // .then((connection) => { 
    //     console.log('-------------- DB CONECTED ----------')
    //     /** init DAO Connections */
    //     CredentialsDAO.injectDB(connection)
    // }).catch(e => console.log(`ERROR CONNECTING TO DB ${e}`))
    
    await MongoClient.connect(url,{ useNewUrlParser: true, poolSize: 50, wtimeout: 2500, useUnifiedTopology: true })
    .then( async (connection:MongoClient) => { 
        console.log('-------------- DB CONECTED ----------')
        /** init DAO Connections */
        await CredentialsDAO.injectDB(connection)
        await ConnectionDAO.injectDB(connection)
    })
    .catch(err => console.log(`ERROR CONNECTING TO DB ${err}`))

}

