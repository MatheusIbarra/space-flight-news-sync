import Article from "../../models/articles.model";
import Event from "../../models/events.model";
import Launch from "../../models/launches.model";
import axios from "axios";
import cliProgress from 'cli-progress';
import { Op } from 'sequelize';
import moment from "moment";

class ArticlesRepository {
    article = Article;
    event = Event;
    launch = Launch;
    constructor() {
        this.event = Event;
        this.launch = Launch;
        this.article = Article;
        this.listAll = this.listAll.bind(this);
        this.listOne = this.listOne.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.cronSync = this.cronSync.bind(this);
    }

    async listAll(offset: number, limit: number): Promise<any[]> {
        const data = await this.article.findAll(
            {
                offset: offset ? offset :  0,
                limit: limit ? limit :  10,   
                include: [
                    {
                        model: Event,
                    },
                    {
                        model: Launch
                    }
                ]
            }
        )
        return data;
    }

    async listOne(id: number): Promise<any> {
        const data = await this.article.findOne({
            where: { id },
            include: [
                {
                    model: Event,
                },
                {
                    model: Launch
                }
            ]
        })
        return data;
    }

    async post(article: Article): Promise<any> {
        const { featured, title, url, imageUrl, newsSite, summary, publishedAt, createdAt, updatedAt, EventId, LaunchId } = article;
        const data = await this.article.create(
            { 
                featured,
                title,
                url,
                imageUrl,
                newsSite,
                summary,
                publishedAt,
                createdAt,
                updatedAt,
                EventId,
                LaunchId
            }
        )

        return data;
    }

    async put(article: Article): Promise<any> {
        const { id, featured, title, url, imageUrl, newsSite, summary, publishedAt, createdAt, updatedAt, EventId, LaunchId } = article;
        const data = await this.article.update(
            { 
                featured,
                title,
                url,
                imageUrl,
                newsSite,
                summary,
                publishedAt,
                createdAt,
                updatedAt,
                EventId,
                LaunchId,
            },
            {
                where: { id }
            }
        )

        return data;
    }

    async delete(id: number): Promise<any> {
        await this.article.destroy(
            {
                where: { id } 
            }
        )

        return true;
    }

    async sync(): Promise<any> {

        const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

        try {
            console.log('\nAntes de sincronizar, iremos apagar todos os dados das tabelas.\n');

            await this.article.destroy({ where: {}});
            await this.event.destroy({ where: {} });
            await this.launch.destroy({ where: {} });
    
            const articlesCount: any = await axios.get('https://api.spaceflightnewsapi.net/v3/articles/count');
            console.log(`\nTemos um total de ${articlesCount.data} dados a serem copiados\n`);
    
            console.log('\nAgora, iremos puxar todos os dados e ir salvando no banco\n');
            const { data }: any = await axios.get(`https://api.spaceflightnewsapi.net/v3/articles/?_limit=50000000  `);
            let count = 0;
    
            let alreadySavedLaunches = [];
            let alreadySavedEvents = [];
            bar.start(articlesCount.data, 0);

            for(const article of data) {
                if(article.launches[0]) {
                    const savedLaunchIndex = alreadySavedLaunches.findIndex(e => e.id === article.launches[0].id);
                    if(savedLaunchIndex < 0) {
                        article.launches[0].createdAt = new Date();
                        article.launches[0].updatedAt = new Date();
                        alreadySavedLaunches.push(article.launches[0]);
                    }

                    article.LaunchId = article.launches[0].id
                }
    
                if(article.events[0]) {
                    const savedLaunchIndex = alreadySavedEvents.findIndex(e => e.id === article.events[0].id);
                    if(savedLaunchIndex < 0) {
                        article.events[0].createdAt = new Date();
                        article.events[0].updatedAt = new Date();
                        alreadySavedEvents.push(article.events[0]);
                    }

                    article.EventId = article.events[0].id
                }

                count = count + 1
                bar.update(count);
            }

            await this.launch.bulkCreate(alreadySavedLaunches);
            await this.event.bulkCreate(alreadySavedEvents);
            await this.article.bulkCreate(data)
    
            bar.stop();
    
            console.log('\nA sincronização terminou !\n');
    
            return true;
        } catch(error) {
            bar.stop();
            console.log(error)
            console.log('\nOcorreu um erro na sincronização.\n');
            return false;
        }
        
    }

    async cronSync(): Promise<any> {
        try {
            const alreadyCreatedArticles = await this.article.findAll(
                {
                    where: { publishedAt: {
                        [Op.gte]: moment().subtract(7, 'days').toDate()
                      } }
                }
            )
    
            const newArticles: any = await axios.get(
                `https://api.spaceflightnewsapi.net/v3/articles?publishedAt_gte=${moment().subtract(7, 'days').toDate().toISOString()}&_limit=1000`
            );
    
            for(const newArticle of newArticles.data) {
                const index = alreadyCreatedArticles.findIndex(e => e.id === newArticle.id);
                if(index < 0) {
    
                    if(newArticle?.events?.length > 0) {
                        const event = await this.event.findOne(
                            {
                                where: { id: newArticle.events[0].id}
                            }
                        )
        
                        if(!event) {
                            await this.event.create(
                                {
                                    id: newArticle.events[0].id,
                                    provider: newArticle.events[0].provider,
                                    createdAt: new Date(),
                                    updatedAt: new Date()
                                }
                            )
                        }
                    }
                   
                    if(newArticle?.launches?.length > 0) {
                        const launch = await this.launch.findOne(
                            {
                                where: { id: newArticle.launches[0].id}
                            }
                        )
    
                        if(!launch) {
                            await this.launch.create(
                                {
                                    id: newArticle.launches[0].id,
                                    provider: newArticle.launches[0].provider,
                                    createdAt: new Date(),
                                    updatedAt: new Date()
                                }
                            )
                        }
                    }
    
                    await this.article.create(
                        {
                            id: newArticle.id,
                            title: newArticle.title,
                            url: newArticle.url,
                            imageUrl: newArticle.imageUrl,
                            newsSite: newArticle.newsSite,
                            summary: newArticle.summary,
                            publishedAt: new Date(newArticle.publishedAt),
                            updatedAt: new Date(newArticle.updatedAt),
                            createdAt: new Date(newArticle.publishedAt),
                            featured: newArticle.featured,
                            LaunchId: newArticle.launches[0]?.id ?? null,
                            EventId: newArticle.events[0]?.id ?? null
        
                        }
                    )
                }
            }
    
            return true;
        } catch (error: any) {
            console.log('\nOcorreu um erro na sincronização.\n');
            return false;
        }
        
    }
}

export default new ArticlesRepository();