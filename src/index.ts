import { config } from './config/config';
import express from 'express';
import router from './routes/route';

const app = express();
const port = config.port;
// Comment before commit
// const API: string = `/api/v${config.apiVersion}`;

app.use(express.json());
// app.use(express.static('public'));
// app.set('view engine', 'ejs');

// Use routes
app.use(router);

app.listen(port, () => {
  // Comment before commit
  // console.log(`Server running at http://localhost:${port}${API}`);
});
