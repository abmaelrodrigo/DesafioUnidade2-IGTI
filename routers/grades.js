import express from 'express';
const router = express.Router();
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

router.post('/', async (req, res, next) => {
  try {
    let grade = req.body;
    const data = JSON.parse(await readFile('gradesTest.json'));

    grade = { id: data.nextId++, ...grade, timestamp: new Date() };
    data.grades.push(grade);

    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));

    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));
    delete data.nextId;
    res.send(data);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));
    const grade = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id)
    );
    res.send(grade);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));
    data.grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id)
    );
    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));
    res.send('Usuário deletado com sucesso!');
    res.end();
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
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
    next(err);
  }
});

router.post('/mediaStudent', async (req, res, next) => {
  try {
    let grade = req.body;
    let sumGrades = 0;

    const data = JSON.parse(await readFile('gradesTest.json'));

    const index = data.grades.find((student) => {
      if (student.student === grade.student) {
        if (student.subject === grade.subject) {
          sumGrades = student.value + sumGrades;
        }
      }
    });
    res.send(
      `Soma das notas da disciplina ${grade.subject} do(a) aluno(a) ${grade.student}: ${sumGrades}`
    );
    res.end();
  } catch (err) {
    next(err);
  }
});

router.post('/mediaSubject', async (req, res, next) => {
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
    next(err);
  }
});

router.post('/bestGrades', async (req, res, next) => {
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
    next(err);
  }
});

router.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send({ error: err.message });
});

export default router;
