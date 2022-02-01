import { Response, Request } from 'express';
import Article from '../../models/articles.model';
import ArticlesService from '../../services/articles/articles.service';

class ArticlesController {

    articlesService = ArticlesService;

    constructor() {
        this.articlesService = ArticlesService;
        this.listAll = this.listAll.bind(this);
        this.listOne = this.listOne.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
        this.sync = this.sync.bind(this);
        this.cronSync = this.cronSync.bind(this);
    }

    async listAll(req: Request, res: Response) {
        try {
            const data = await this.articlesService.listAll(Number(req.query.offset), Number(req.query.limit));
            res.status(200).json({ success: true, message: '', data }).end();
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    }

    async listOne(req: Request, res: Response) {
        try {
            const data = await this.articlesService.listOne(req.params.id);
            if(data) {
                res.status(200).json({ success: true, message: '', data }).end();
            } else {
                res.status(404).json({ success: false, message: 'Artigo não encontrado' }).end();
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    }

    async post(req: Request, res: Response) {
        try {
            const article = new Article({...req.body, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date()})
            const data = await this.articlesService.post(article);
            res.status(200).json({ success: true, message: '', data }).end();
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    }

    async put(req: Request, res: Response) {
        try {
            const article = new Article({...req.body, updatedAt: new Date()})
            article.id = req.params.id;
            const data = await this.articlesService.put(article);
            res.status(200).json({ success: true, message: '', data }).end();
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const data = await this.articlesService.delete(req.params.id);
            if(data) {
                res.status(200).json({ success: true, message: '', data }).end();
            } else {
                res.status(404).json({ success: false, message: 'Artigo não encontrado' }).end();
            }
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    }

    async sync(req: Request, res: Response) {
        try {
            this.articlesService.sync();
            res.status(200).json({ success: true, message: 'Sincronização em andamento, por favor, não desligue o serviço ou o banco de dados.' }).end();
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    }

    async cronSync(req: Request, res:Response) {
        try {
            await this.articlesService.cronSync();
            res.status(200).json({ success: true, message: 'Sincronização por cron realizada com sucesso!' }).end();
        } catch (error) {
            res.status(500).json({ success: false, message: error })
        }
    }

}

export default new ArticlesController();