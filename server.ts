import express from 'express';
import cron from 'node-cron';
import { createServer } from 'http';

import Routes from './src/routes';
import articlesRepository from './src/repositories/articles/articles.repository';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
createServer(app);

new Routes(app);

app.use('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Back-end Challenge 2021 🏅 - Space Flight News'})
})

app.listen(3333, () => {
    console.log('Runnning on port 3333');
    cron.schedule('0 9 * * *',  () => articlesRepository.cronSync())
});

export default app;