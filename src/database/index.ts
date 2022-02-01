import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

class Database {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private databaseconfig?: Object;

    public connection!: Sequelize.Sequelize;

    constructor() {
        this.databaseconfig = databaseConfig;
        this.init();
    }

    init(): void {
        this.connection = new Sequelize.Sequelize(this.databaseconfig);
        this.connection.sync();
    }
}

const database: Database = new Database();

export default database;
