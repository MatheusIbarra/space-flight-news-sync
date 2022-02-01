declare namespace Express {
    export interface Request {
       id?: number,
       UserTypeId?: number,
       language?: string,
       polyglot?: any
    }
 }