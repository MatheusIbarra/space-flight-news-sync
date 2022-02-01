import Article from "../../models/articles.model";
import ArticlesRepository from "../../repositories/articles/articles.repository";

class ArticlesService {

    articlesRepository = ArticlesRepository;

    constructor(){

        this.articlesRepository = ArticlesRepository;

        this.listAll = this.listAll.bind(this);
        this.listOne = this.listOne.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
        this.sync = this.sync.bind(this);
        this.cronSync = this.cronSync.bind(this);
    }

    async listAll(offset: number, limit: number): Promise<Article[]> {
        const data = await this.articlesRepository.listAll(offset, limit);
        return data;
    }

    async listOne(id: number): Promise<Article> {
        const data = await this.articlesRepository.listOne(id);
        return data;
    }

    async post(article: Article): Promise<any> {
        const data = await this.articlesRepository.post(article);
        return data;
    }

    async put(article: Article, newId?: number): Promise<any> {
        const data = await this.articlesRepository.put(article);
        return data;
    }

    async delete(id: number): Promise<Article> {
        const data = await this.articlesRepository.delete(id);
        return data;
    }

    async sync(): Promise<any> {
        const data = await this.articlesRepository.sync();
        return data;
    }

    async cronSync(): Promise<any> {
        const data = await this.articlesRepository.cronSync();
        return data;
    }
}

export default new ArticlesService();