import Sequelize, { Model } from 'sequelize';
import database from '../database';
import Event from './events.model';
import Launch from './launches.model';

class Article extends Model {
    public id!: number;
    public featured!: boolean;
    public title!: string;
    public url!: string;
    public imageUrl!: string;
    public EventId!: string;
    public LaunchId!: string;
    public newsSite!: string;
    public summary!: string;
    public publishedAt!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Article.init(
    {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        featured: { type: Sequelize.BOOLEAN, allowNull: false },
        title: { type: Sequelize.STRING(500), allowNull: false },
        url: { type: Sequelize.STRING(500), allowNull: false },
        imageUrl: { type: Sequelize.STRING(500), allowNull: true },
        newsSite: { type: Sequelize.STRING(500), allowNull: true },
        summary: { type: Sequelize.TEXT, allowNull: false },
        publishedAt: { type: Sequelize.DATE, allowNull: false },
    },
    {
        sequelize: database.connection,
        freezeTableName: true,
        tableName: 'articles',
    },
)



export default Article;