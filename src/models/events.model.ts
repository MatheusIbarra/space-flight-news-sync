import Sequelize, { Model } from 'sequelize';
import database from '../database';
import Article from './articles.model';

class Event extends Model {
    public id!: string;
    public provider!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Event.init(
    {
        id: { type: Sequelize.STRING(500), primaryKey: true },
        provider: { type: Sequelize.STRING(500), allowNull: false },
    },
    {
        sequelize: database.connection,
        freezeTableName: true,
        tableName: 'events',
    },
)

Event.hasMany(Article)
Article.belongsTo(Event)

export default Event;