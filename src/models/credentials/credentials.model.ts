import { ObjectId } from "bson";
//import { isValidObjectId, ObjectId } from "mongoose";
import { nanoid } from "nanoid";
export interface CredentialJSON {
    key?: string
    host: string,
    user: string,
    password: string ,
    database?: string,
    port?: number,
    db_engine: string
}

export class Credentials implements CredentialJSON {
    key?: string
    host: string;
    user: string;
    password: string;
    database?: string;
    port?: number;
    db_engine: string;

    //objectId = new ObjectId()
    
    constructor(params?: CredentialJSON) {
        if (!params) {
            this.key = null
            this.host = null
            this.user = null
            this.password = null
            this.database = null
            this.port = null
            this.db_engine = null
        } else {
            this.key = params.key || nanoid(18)
            this.host = params.host || '127.0.0.1'
            this.user = params.user || 'no user'
            this.password = params.password || 'no password'
            this.database = params.database || 'no database name'
            this.port = params.port || 3306
            this.db_engine = params.db_engine || null
        }
    }
    
}