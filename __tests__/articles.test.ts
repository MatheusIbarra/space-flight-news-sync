import Article from '../src/models/articles.model';
import articlesService from '../src/services/articles/articles.service';

jest.setTimeout(50000)

describe('Articles', () => {
    it('should return some articles when get this route, if have limit, return the max limit', async () => {
        const data = await articlesService.listAll(0, 10);
        expect(data.length).toBe(10)
    });
    it('should return a specific article when get this route', async () => {
        const data = await articlesService.listOne(3000);
        expect(data.id).toBe(3000)
    });
    it('should post, edit and delete an article when get this route', async () => {
        const data = await articlesService.post(new Article({
                featured: true,
                title: 'jestTest',
                url: 'jestTest',
                imageUrl: 'jestTest',
                newsSite: 'jestTest',
                summary: 'jestTest',
                publishedAt: new Date(), 
                createdAt: new Date(), 
                updatedAt: new Date()
        }));

        await articlesService.put({...data, id: data.id, title: "EDIT JEST TEST"})

        const deleteArticle = await articlesService.delete(data.id);

        expect(deleteArticle).toBe(true)
    });
})

describe('Syncronize', () => {
    it('should syncronize with space flight api without errors', async () => {
        const sync = await articlesService.sync();
        expect(sync).toBe(true)
    })
    it("should call the cron function, to sync and get all the today's articles", async () => {
        const sync = await articlesService.cronSync();
        expect(sync).toBe(true)
    })

})
