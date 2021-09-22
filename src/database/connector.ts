import { CredentialJSON, Credentials } from "../models";
import { ConnectionJSON, Connections } from "../models/connections/connections.model";
import credentialsService from '../api/services/credentials/credentials.service'
import pg from 'pg'
import mysql from 'mysql'
import connectionsService from "../api/services/connections/connections.service";

export class Connector {
    connection: Connections
    open: boolean
    static open: boolean;

    constructor() {}

    /** mysql connection to open and save credential and connection */
    static async mySQLConnection(data:Credentials) {
        return new Promise((resolve, reject) => {
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
                    console.log('error with mysql pool connection', err)
                    reject('error')
                }
                
                /** Save credentials */
                let credentialData = data
                let credential = new Credentials(credentialData)
                await credentialsService.create(credential)
                
                /** Save connection (with credential) */
                let conn: ConnectionJSON= {
                    credentials: credential,
                    db_engine: credential.db_engine
                }
                let newConn = new Connections(conn)
                await connectionsService.create(newConn)

    
                resolve('connected')
    
            })
        })
    }

    /** postgresql connection to open and save credential and connection */
    static async postgreSQLConnection(data:Credentials) {
        return new Promise(async (resolve, reject) => {
            //console.log(data)
            const postgreSQL = {
                user: data.user,
                host: data.host,
                database: data.database,
                password: data.password,
                port: data.port
            }

            let connectionString = `postgres://${postgreSQL.user}:${postgreSQL.password}@${postgreSQL.host}:${postgreSQL.port}/${postgreSQL.database}`

            console.log('connection string --> ', connectionString)

            let client = new pg.Client(connectionString)

            client.connect( async (error) => {
                if (error) {
                    reject ('error')
                    console.log('Error connecting to postgreSQL database')
                    console.log(error)
                }

                /** Save credentials */
                let credentialData = data
                let credential = new Credentials(credentialData)
                await credentialsService.create(credential)

                /** Save connection (with credential) */
                let conn: ConnectionJSON= {
                    credentials: credential,
                    db_engine: credential.db_engine
                }
                let newConn = new Connections(conn)
                await connectionsService.create(newConn)
    
                resolve('connected')
            })

            // let query = client.query(`SELECT *
            // FROM public."Books"`)

            // query.then(res =>  console.log(res)).catch(error => console.log(error))

            // client.end().then(() => console.log(`------- PostgreSQL connection ended  -------`))
            // .catch(error => console.log(`there was an error connection ${error}`) )
        }) 
    }

    /** mysql test connection and response of succes or failure */
    static async testMySQLConnection(data: Credentials) {
        return new Promise(async (resolve, reject) => {
            let mysqlConfig = {
                host : data.host,
                user : data.user,
                password : data.password 
            }
    
            console.log('TEST CONNECTION CONFIG --> ', mysqlConfig)
    
            let connection = await mysql.createConnection(mysqlConfig)
            
            await connection.connect((err) => {
                if (err) {
                    console.log(`Error connecting ${err}`)
                    reject('error')
                }
                resolve('connected')
            })

            await connection.end((err) => {
                if (err) {
                    console.log(`Error connecting ${err}`)
                    return
                }
    
                console.log('---- test connection closed -----');
            })
        })
    
    }

    /** postgresql test connection and response of succes or failure */    
    static async testPostgreSQLConnection(data: CredentialJSON) {
        return new Promise(async (resolve, reject) => {
            //console.log(data)
            const postgreSQL = {
                user: data.user,
                host: data.host,
                database: data.database,
                password: data.password,
                port: data.port
            }

            let connectionString = `postgres://${postgreSQL.user}:${postgreSQL.password}@${postgreSQL.host}:${postgreSQL.port}/${postgreSQL.database}`

            console.log('connection string --> ', connectionString)

            let client = new pg.Client(connectionString)

            client.connect(error => {
                if (error) {
                    reject ('error')
                    console.log('Error connecting to postgreSQL database')
                    console.log(error)
                    
                }
    
                resolve('connected')
            })

            // let query = client.query(`SELECT *
            // FROM public."Books"`)

            // query.then(res =>  console.log(res)).catch(error => console.log(error))

            // client.end().then(() => console.log(`------- PostgreSQL connection ended  -------`))
            // .catch(error => console.log(`there was an error connection ${error}`) )
        })  
    }

    /** -------------------------- GV REQUESTS ---------------------------------- */

    static async postgreSQLConnectionMainNodes(data:Credentials) {
        return new Promise(async (resolve, reject) => {
            //console.log(data)
            const postgreSQL = {
                user: data.user,
                host: data.host,
                database: data.database,
                password: data.password,
                port: data.port
            }

            let connectionString = `postgres://${postgreSQL.user}:${postgreSQL.password}@${postgreSQL.host}:${postgreSQL.port}/${postgreSQL.database}`

            console.log('connection string --> ', connectionString)

            let client = new pg.Client(connectionString)

            client.connect( async (error) => {
                if (error) {
                    reject ([])
                    console.log('Error connecting to postgreSQL database')
                    console.log(error)
                }
            })

            //let query = client.query(`SELECT * FROM public."Books"`)
            let query = client.query(`SELECT * FROM information_schema.tables`)

            query.then(res =>  {

                let values = res.rows
                let notPgValues = []

                for (let i = 0; i < values.length; i++) {
                    const value = values[i];
                    if(value.table_schema !== 'pg_catalog' && value.table_schema !== 'information_schema') notPgValues.push(value)
                }

                resolve(notPgValues)
            
            }).catch(error => {
                console.log(error) 
                reject([])
            })

            // client.end().then(() => console.log(`------- PostgreSQL connection ended  -------`))
            // .catch(error => console.log(`there was an error connection ${error}`) )
        }) 
    }

} 