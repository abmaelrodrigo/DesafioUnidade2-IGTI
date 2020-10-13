import express from 'express';
const router = express.Router();
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

router.post('/', async (req, res) => {
  try {
    let grade = req.body;
    const data = JSON.parse(await readFile('gradesTest.json'));

    grade = { id: data.nextId++, ...grade, timestamp: new Date() };
    data.grades.push(grade);

    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));

    res.send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));
    delete data.nextId;
    res.send(data);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));
    const grade = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id)
    );
    res.send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));
    data.grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id)
    );
    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));
    res.send('Usuário deletado com sucesso!');
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let grade = req.body;

    const data = JSON.parse(await readFile('gradesTest.json'));
    const index = data.grades.findIndex(
      (gradeIndex) => gradeIndex.id === grade.id
    );

    data.grades[index] = { ...grade, timestamp: new Date() };

    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));
    res.send(grade);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/mediaStudent', async (req, res) => {
  try {
    let grade = req.body;
    let sumGrades = 0;

    const data = JSON.parse(await readFile('gradesTest.json'));
    //console.log(grade.subject);
    //res.send(grade.subject);

    const index = data.grades.find((student) => {
      if (student.student === grade.student) {
        if (student.subject === grade.subject) {
          sumGrades = student.value + sumGrades;
        }
      }
    });
    res.send(`Soma das notas da disciplina ${grade.subject}: ${sumGrades}`);
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/mediaSubject', async (req, res) => {
  try {
    let grade = req.body;
    let sumValues = 0;
    let countRegisters = 0;

    const data = JSON.parse(await readFile('gradesTest.json'));

    const index = data.grades.find((subject) => {
      if (subject.subject === grade.subject) {
        if (subject.type === grade.type) {
          countRegisters++;
          sumValues = subject.value + sumValues;
        }
      }
    });
    res.send(
      `Média da disciplina ${grade.subject} tipo ${grade.type}: ${
        sumValues / countRegisters
      }`
    );
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.post('/bestGrades', async (req, res) => {
  try {
    let grade = req.body;
    let gradesArray = [];
    let sumValues = 0;
    let countRegisters = 0;

    const data = JSON.parse(await readFile('gradesTest.json'));

    const index = data.grades.find((subject) => {
      if (subject.subject === grade.subject) {
        if (subject.type === grade.type) {
          gradesArray.push(parseInt(subject.value));

          //countRegisters++;
          //sumValues = subject.value + sumValues;
        }
      }
    });
    const sortedArray = gradesArray
      .sort((a, b) => {
        if (a > b) return -1;
        if (a < b) return 1;
        if (a === b) return 0;
      })
      .slice(0, 3);
    res.send(
      `Melhores notas da disciplina ${grade.subject}, tipo ${grade.type}: ${sortedArray}`
    );
    res.end();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
