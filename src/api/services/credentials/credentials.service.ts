import { CredentialJSON, Credentials } from "../../../models/credentials/credentials.model";
import { Service } from "../service.interface";
import CredentialsDAO from "../../../dao/credentialsDAO";

class CredentialsService implements Service<CredentialJSON> {

    getTotal(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    create(item: CredentialJSON): Promise<void> {
        return this.save(item)
    }

    async update(key: string, item: CredentialJSON): Promise<any> {
        let credentialUpdated = await CredentialsDAO.updateCredential(key, item)
        return credentialUpdated
    }

    patch?(changes: any): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async save(item: CredentialJSON): Promise<any> {

        const credential = new Credentials(item)
        const insertResult = await CredentialsDAO.addCredential(item)

        if (!insertResult.success) {
            throw new Error("Can't insert credential to database");
        }

        let credentialCreated = await CredentialsDAO.getCredential(credential)

        return Promise.resolve(credentialCreated).catch(error => console.log(error))
    }

    async get(key: any): Promise<any> {
        let credential = await CredentialsDAO.getCredential(key)
        return credential
    }

    async list(query?: any): Promise<any> {
       const credentials = await CredentialsDAO.getCredentials()
       return credentials
    }

    async delete(credentialKey: any): Promise<any> {
        let credentialDeleted = await CredentialsDAO.deleteCredential(credentialKey)
        return credentialDeleted
    }

}

const credentialsService = new CredentialsService()
export default credentialsService