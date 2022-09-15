import MongoStore from 'connect-mongo';

const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    ttl: 20000
});

export const sessionOptions = {};
