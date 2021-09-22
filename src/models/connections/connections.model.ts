import { ObjectId } from "bson";
//import { isValidObjectId, ObjectId } from "mongoose";
import { nanoid } from "nanoid";
import { CredentialJSON } from "../credentials/credentials.model";
export interface ConnectionJSON {
    key?: string
    credentials: CredentialJSON,
    open?: boolean,
    db_engine: string
}

export class Connections implements ConnectionJSON  {
    key?: string
    credentials: CredentialJSON;
    open: boolean;
    db_engine: string;

    constructor(params?: ConnectionJSON) {
        if (!params) {
            this.key = null
            this.credentials = null
            this.open = null
            this.db_engine = null
        } else {
            this.key = nanoid(18)
            this.credentials =  params.credentials || null
            this.open = params.open || false
            this.db_engine = params.db_engine || null
        }
    }
    
}