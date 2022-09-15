import { connect } from 'mongoose';
import { Logger } from '../library/Logging.library';
import 'dotenv/config';

// export const connectToDatabase = async () => {
//     try {
//         await connect(process.env.MONGODB_URL as string, { w: 'majority', retryWrites: true });
//         Logger.info('connected to database');
//     } catch (error) {
//         Logger.error(error);
//         process.exit(1);
//     }
// };

// ini pake class
class ConnectToDatabase {
    private _url: string;
    constructor(url: string) {
        this._url = url;
    }

    private async connecting() {
        try {
            await connect(this._url, { w: 'majority', retryWrites: true });
            Logger.info('connected to database');
        } catch (error) {
            Logger.error(error);
            process.exit(1);
        }
    }

    public connectToDatabase = () => {
        this.connecting();
    };
}

const { connectToDatabase } = new ConnectToDatabase(process.env.MONGODB_URL as string);

export default connectToDatabase;
