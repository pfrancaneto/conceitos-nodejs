const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories); 
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const respository = { 
    id: uuid(),
    title, 
    url, 
    techs,
    likes: 0, 
  }; 

  repositories.push(respository);
  
  return response.json(respository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const respositoryIndex = repositories.findIndex(respository => respository.id === id);

  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  repositories[respositoryIndex] = {
    id,
    title: title ? title : repositories[respositoryIndex].title,
    url: url ? url : repositories[respositoryIndex].url,
    techs: techs ? techs : repositories[respositoryIndex].techs,
    likes: repositories[respositoryIndex].likes
  }

  
  return response.json(repositories[respositoryIndex]);
}); 

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const respositoryIndex = repositories.findIndex(respository => respository.id === id);

  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  repositories.splice(respositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const respositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (respositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  repositories[respositoryIndex].likes += 1;

  return response.json(repositories[respositoryIndex]);
 
});

module.exports = app;
