export {};

declare global {
    namespace NodeJs {
        interface ProcessEnv {
            PORT: number;
            NODE_ENV: string;
            MONGODB_URL: string;
            PASSWORD_ADMIN: string;
            USERNAME_ADMIN: string;
            USER: string;
            PASS: string;
        }
    }
}
