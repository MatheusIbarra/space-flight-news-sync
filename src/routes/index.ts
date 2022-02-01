import { Router } from 'express';
import articlesRouter from './articles/articles.router';
const swaggerDocs = require("../docs.json");
import swaggerUi from 'swagger-ui-express';

class Routes {
    constructor(app: Router) {
        app.use('/articles', articlesRouter)
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    }
}

export default Routes;