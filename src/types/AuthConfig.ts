export type AuthConfig = {
    connectionString: string,
    jwtKey: string,
    dbName: string,
    userCollection: string,
    userModel: any,
    routes?: {
        registration?: '/create',
        login?: '/login',
    }
}