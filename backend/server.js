// Bibliotecas
import express from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';

// Iniciando o Express.JS
const server = express();
const port = 3030;
server.use(express.json());

// "Database"
let users = [];

// Registrar Usuarios
server.post('/api/users', async (req, res) => {
  const { name, birth, cpf, gender, height, weight } = req.body;

  function formatDate(birthDate) {
    const [day, month, year] = birthDate.split('/');
    return `${year}-${month}-${day}`;
  }

  async function getAgeFromDate(date) {
    const formattedDate = formatDate(date);
    const url = `https://digidates.de/api/v1/age/${formattedDate}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.age;
  }

  try {
    const age = await getAgeFromDate(birth);
    const nameBase = name.toLowerCase().replace(/\s/g, '') + formatDate(birth).replace('-', '');
    const fullHash = crypto.createHash('sha256').update(nameBase).digest('hex');
    const onlyNumbers = fullHash.replace(/\D/g, '');

    const numericHash = onlyNumbers.slice(0, 15);

    const user = {
      hash: numericHash,
      name,
      cpf,
      gender,
      height,
      weight,
      birth,
      age
    };

    users.push(user);

    let usersNames = []
    for (let i = 0; i < users.length; i++) {
      let temp_name = users[i].name
      let temp_hash = users[i].hash
      usersNames.push(`${temp_hash} | ${temp_name}`)
    }
    await console.clear()
    console.log(`⛁ | Database Updated - ${users.length}`);
    console.log(usersNames)
    res.send(user);
    
  } catch (error) {
    console.error('Erro ao buscar idade:', error);
    res.status(500).send({ erro: 'Erro ao obter a idade via API externa.' });
  }
});

// Consultar Usuarios
server.get('/api/users/:hash', (req, res) => {
  let person = users.find(user => user.hash === req.params.hash);
  res.status(200).send(person);
})

server.listen(port, () => console.log(`✅ | Servidor rodando na porta ${port}`));
