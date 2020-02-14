/*
play this: https://www.youtube.com/watch?v=d-diB65scQU

Sing along:

here's a little code I wrote, please read the README word for word, don't worry, you got this
in every task there may be trouble, but if you worry you make it double, don't worry, you got this
ain't got no sense of what is REST? just concentrate on learning Express, don't worry, you got this
your file is getting way too big, bring a Router and make it thin, don't worry, be crafty
there is no data on that route, just write some code, you'll sort it out… don't worry, just hack it…
I need this code, but don't know where, perhaps should make some middleware, don't worry, just hack it

Go code!
*/

const express = require("express");
const helmet = require("helmet");
var cors = require("cors");

const Actions = require("./data/helpers/actionModel.js");
const Projects = require("./data/helpers/projectModel.js");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get("/actions", (req, res) => {
  Actions.get().then(projects => {
    res.status(200).json(projects);
  });
});

server.get("/projects", (req, res) => {
  Projects.get().then(projects => {
    res.status(200).json(projects);
  });
});

server.get("/projects/:id", (req, res) => {
  Projects.get(req.params.id).then(project => {
    res.status(200).json(project);
  });
});

server.get("/actions/:id", (req, res) => {
  Actions.get(req.params.id).then(actions => {
    res.status(200).json(actions);
  });
});

server.delete("/projects/:id", (req, res) => {
  Projects.remove(req.params.id).then(project => {
    res.status(200).json(project);
  });
});

server.delete("/actions/:id", (req, res) => {
  Actions.remove(req.params.id).then(action => {
    res.status(200).json(action);
  });
});

server.get("/projects/:id/actions", (req, res) => {
  Projects.getProjectActions(req.params.id).then(project => {
    res.status(200).json(project);
  });
});

server.post("/actions", (req, res) => {
  const actionInfo = req.body;
  Projects.get(actionInfo.project_id)
    .then(project => {
      if (project) {
        Actions.insert(actionInfo)
          .then(action => {
            res.status(201).json(action);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "something went awry" });
          });
      } else {
        res.status(404).json({ errorMessage: "incorect project_id" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "something went awry" });
    });
});

server.post("/projects", (req, res) => {
  const projectInfo = req.body;

  Projects.insert(projectInfo)
    .then(project => {
      res.status(201).json(project);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: "something went awry" });
    });
});

server.put("/projects/:id", (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(project => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: "The project could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "something went awry"
      });
    });
});

server.put("/actions/:id", (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(action => {
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ message: "The action could not be found" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "something went awry"
      });
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`));
