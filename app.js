const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const hasPriorityAndStatus = (requestQuery, response) => {
  if (requestQuery.priority != undefined && requestQuery.status != undefined) {
    const priorityArr = ["HIGH", "MEDIUM", "LOW"];
    const isValidPriority = priorityArr.includes(requestQuery.priority);

    const statusArr = ["TO DO", "IN PROGRESS", "DONE"];
    const isValidStatus = statusArr.includes(requestQuery.status);

    if (isValidPriority === true && isValidStatus === true) {
      return true;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority/Status");
    }
  } else {
    return false;
  }
};

const hasCategoryAndStatus = (requestQuery, response) => {
  if (requestQuery.category != undefined && requestQuery.status != undefined) {
    const categoryArr = ["WORK", "HOME", "LEARNING"];
    const isValidCategory = categoryArr.includes(requestQuery.category);

    const statusArr = ["TO DO", "IN PROGRESS", "DONE"];
    const isValidStatus = statusArr.includes(requestQuery.status);

    if (isValidCategory === true && isValidStatus === true) {
      return true;
    } else {
      response.status(400);
      response.send("Invalid Todo Category/Status");
    }
  } else {
    return false;
  }
};

const hasCategoryAndPriority = (requestQuery, response) => {
  if (
    requestQuery.category != undefined &&
    requestQuery.priority != undefined
  ) {
    const categoryArr = ["WORK", "HOME", "LEARNING"];
    const isValidCategory = categoryArr.includes(requestQuery.category);

    const priorityArr = ["HIGH", "MEDIUM", "LOW"];
    const isValidPriority = priorityArr.includes(requestQuery.priority);

    if (isValidCategory === true && isValidPriority === true) {
      return true;
    } else {
      response.status(400);
      response.send("Invalid Todo Category/Priority");
    }
  } else {
    return false;
  }
};

const hasStatus = (requestQuery, response) => {
  if (requestQuery.status != undefined) {
    const statusArr = ["TO DO", "IN PROGRESS", "DONE"];
    const isValidStatus = statusArr.includes(requestQuery.status);

    if (isValidStatus === true) {
      return true;
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    return false;
  }
};

const hasPriority = (requestQuery, response) => {
  if (requestQuery.priority != undefined) {
    const priorityArr = ["HIGH", "MEDIUM", "LOW"];
    const isValidPriority = priorityArr.includes(requestQuery.priority);

    if (isValidPriority === true) {
      return true;
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else {
    return false;
  }
};

const hasCategory = (requestQuery, response) => {
  if (requestQuery.category != undefined) {
    const categoryArr = ["WORK", "HOME", "LEARNING"];
    const isValidCategory = categoryArr.includes(requestQuery.category);

    if (isValidCategory === true) {
      return true;
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    return false;
  }
};

app.get("/todos/", async (request, response) => {
  const { search_q = "", priority, status, category } = request.query;
  let todoList = null;
  let selectTodoQuery = "";

  switch (true) {
    case hasPriorityAndStatus(request.query, response):
      selectTodoQuery = `
          SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND priority = '${priority}' AND status = '${status}';`;
      break;
    case hasCategoryAndStatus(request.query, response):
      selectTodoQuery = `
          SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND category = '${category}' AND status = '${status}';`;
      break;
    case hasCategoryAndPriority(request.query, response):
      selectTodoQuery = `
          SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND category = '${category}' AND priority = '${priority}';`;
      break;
    case hasStatus(request.query, response):
      selectTodoQuery = `
          SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND status = '${status}';`;
      break;
    case hasPriority(request.query, response):
      selectTodoQuery = `
          SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND priority = '${priority}';`;
      break;
    case hasCategory(request.query, response):
      selectTodoQuery = `
          SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND category = '${category}';`;
      break;
    default:
      selectTodoQuery = `
          SELECT * FROM todo WHERE todo LIKE '%${search_q}%';`;
      break;
  }
  todoList = await db.all(selectTodoQuery);
  response.send(todoList);
});
