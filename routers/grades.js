import express from 'express';
const router = express.Router();
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

router.post('/', async (req, res, next) => {
  try {
    let grade = req.body;

    //validação dos elementos recebidos:
    if (
      !grade.student ||
      !grade.subject ||
      !grade.type ||
      grade.value == null
    ) {
      throw new Error(
        'Os campos student, subject, type e value são obrigatórios.'
      );
    }

    const data = JSON.parse(await readFile('gradesTest.json'));

    grade = {
      id: data.nextId++,
      student: grade.student,
      subject: grade.subject,
      type: grade.type,
      timestamp: new Date(),
    };

    data.grades.push(grade);

    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));

    res.send(grade);

    logger.info(`POST /grades - ${JSON.stringify(grade)}`);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));
    delete data.nextId;
    res.send(data);
    logger.info('GET /grades');
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  let receivedID = req.params.id;
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));

    const grade = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id)
    );
    if (typeof grade === 'undefined') {
      throw new Error('ID não encontrado');
    }
    res.send(grade);
    logger.info('GET /grades/:id');
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile('gradesTest.json'));

    const userID = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id)
    );
    if (typeof userID === 'undefined') {
      throw new Error('ID não encontrado');
    }

    data.grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id)
    );
    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));
    res.send('Usuário deletado com sucesso!');

    logger.info(`GET /grades/:id - ${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    let grade = req.body;
    if (
      grade.id == null ||
      !grade.student ||
      !grade.subject ||
      !grade.type ||
      grade.value == null
    ) {
      throw new Error(
        'Os campos id, student, subject, type e value são obrigatórios.'
      );
    }

    const data = JSON.parse(await readFile('gradesTest.json'));
    const index = data.grades.findIndex(
      (gradeIndex) => gradeIndex.id === grade.id
    );

    if (index === -1) {
      throw new Error('Registro não encontrado');
    }
    data.grades[index] = {
      id: grade.id,
      student: grade.student,
      subject: grade.subject,
      type: grade.type,
      timestamp: new Date(),
    };

    await writeFile('gradesTest.json', JSON.stringify(data, null, 2));
    res.send(grade);
    logger.info(`PUT /grades - ${JSON.stringify(grade)}`);
  } catch (err) {
    next(err);
  }
});

router.post('/mediaStudent', async (req, res, next) => {
  try {
    let grade = req.body;
    let sumGrades = 0;

    if (!grade.student || !grade.subject) {
      throw new Error('Os campos student e  subject são obrigatórios.');
    }

    const data = JSON.parse(await readFile('gradesTest.json'));

    const findedGrades = data.grades.find((student) => {
      if (student.student === grade.student) {
        if (student.subject === grade.subject) {
          sumGrades = student.value + sumGrades;
        }
      }
    });

    console.log(typeof findedGrades);

    res.send(
      `Soma das notas da disciplina ${grade.subject} do(a) aluno(a) ${grade.student}: ${sumGrades}`
    );
    logger.info(`POST /grades/mediaStudent - ${sumGrades}`);
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

    if (!grade.subject || !grade.type) {
      throw new Error('Os campos subject e  type são obrigatórios.');
    }

    const data = JSON.parse(await readFile('gradesTest.json'));

    const findedSubject = data.grades.find((subject) => {
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
    logger.info(`POST /grades/mediaSubject - ${sumValues / countRegisters}`);

    res.end();
  } catch (err) {
    next(err);
  }
});

router.post('/bestGrades', async (req, res, next) => {
  try {
    let grade = req.body;
    let gradesArray = [];

    if (!grade.subject || !grade.type) {
      throw new Error('Os campos subject e  type são obrigatórios.');
    }

    const data = JSON.parse(await readFile('gradesTest.json'));

    const findedBestGrade = data.grades.find((subject) => {
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
    logger.info(`POST /grades/bestGrades - ${sortedArray}`);

    res.end();
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
