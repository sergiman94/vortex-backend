import { MongoClient, Collection } from "mongodb"
import { CredentialJSON } from "../../src/models"

let credentials: Collection<any>

export default class CredentialsDAO {

    /** injected mongo db collection connection from server index */
    static async injectDB(conn:MongoClient) {
        try {
            credentials = await conn.db(process.env.MAIN_DB).collection("credentials")
        } catch (e) {
            console.log(`There was a problem connection to the CredentiañDAO ${e}`)
        }
    }

    static async addCredential(credentialData: CredentialJSON) {
        try {
            await credentials.insertOne(credentialData)
            return {success: true, data: credentialData}
        } catch (error) {
            if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
                return { error: "A credential with the given data already exists." }
            }
            console.error(`Error occurred while adding credential, ${error}.`)
            return { error: error }
        }
    }

    static async getCredential(credentialKey){
        try {
            let credential = await credentials.findOne({ key: credentialKey})
            return credential
        } catch (error) {
            console.log(`Error getting credential --> ${error}`)
            return {error:`Error getting credential --> ${error}`}
        }
    }

    static async getCredentials () {
        try {
            let credentialsList = await credentials.find().toArray()
            return credentialsList
        } catch (error) {
            console.log(`Error listing credentials --> ${error}`)
            let credentialsList = []
            return credentialsList
        }
    }

    static async updateCredential (credentialKey, credential: CredentialJSON) {
        try {
            const updateResponse = await credentials.updateOne(
                {key: credentialKey},
                {$set: {
                    host: credential.host,
                    user: credential.user,
                    database: credential.database,
                    port: credential.port
                }}
            )

            if (updateResponse.matchedCount === 0) {
                throw new Error("Couldn't find a match for this credential");
            }

            return updateResponse
        } catch (error) {
            console.log('error updating credential', error)
            return {error: `Error updating credential --> ${error}`}
        }
    }

    static async deleteCredential (credentialKey) {
        try {
            await credentials.deleteOne({key: credentialKey})

            if ( !(await this.getCredential(credentialKey))) {
                return {success: `Credential ${credentialKey} successfully deleted`}
            } else {
                return {error: `Can not delete credential ${credentialKey}`}
            }

        } catch (error) {
            console.log(`Error deleting credential --> ${error}`)
            return {error: `Can not delete credential ${credentialKey} error ${error}`}
        }
    }
}