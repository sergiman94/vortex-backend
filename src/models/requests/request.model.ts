import { CredentialJSON } from "../credentials/credentials.model";

export interface GVRequestJSON {
    credentials ?: CredentialJSON,
    action ?: string
}