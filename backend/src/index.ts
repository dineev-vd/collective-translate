import './pre-start'; // Must be the first import
import app from '@server';
import logger from '@shared/Logger';
import { createConnection } from 'typeorm';

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_PASSWORD,
    POSTGRES_USER,
    POSTGRES_DB
} = process.env;

// Start the server
const port = Number(process.env.PORT || 3000);

createConnection({
    type: 'postgres',
    host: POSTGRES_HOST,
    port: +(POSTGRES_PORT ?? 5432),
    database: POSTGRES_DB,
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    dropSchema: true,
    synchronize: true,
    entities: ["src/entities/**/*.ts"]
}).then(_connection => {
    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
})
