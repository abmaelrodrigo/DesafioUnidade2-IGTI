import express from 'express';
import accountsRounter from './routers/grades.js';

import { promises as fs } from 'fs';

const app = express();
app.use(express.json());
app.use('/grades', accountsRounter);

app.listen(3000, async () => {
  try {
    const file = await fs.readFile('gradesTest.json');
    //console.log(JSON.parse(file));
    console.log('API Started');
  } catch (error) {}
});
