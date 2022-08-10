const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: "Project not found." })
  }

  return next();
}

function checkIdExists(req, res, next) {
  const { id } = req.body;
  const idExists = projects.find(p => p.id == id);

  if (idExists) {
    return res.json({error: "The id already exists."})
  }

  return next();
}

function logRequests(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/projects', checkIdExists, (req, res) => {
  const { id, title } = req.body;

  projects.push({id, title, tasks: []})

  return res.json(projects)
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project)
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projectTask = projects.find(p => p.id == id);

  projectTask.tasks.push(title)

  return res.json(projectTask);
})

server.listen(4000);