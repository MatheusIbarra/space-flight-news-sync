import Sequelize, { Model } from 'sequelize';
import database from '../database';
import Article from './articles.model';

class Launch extends Model {
    public id!: string;
    public provider!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Launch.init(
    {
        id: { type: Sequelize.STRING(500), primaryKey: true },
        provider: { type: Sequelize.STRING(500), allowNull: false },
    },
    {
        sequelize: database.connection,
        freezeTableName: true,
        tableName: 'launches',
    },
)

Launch.hasMany(Article)
Article.belongsTo(Launch)

export default Launch;