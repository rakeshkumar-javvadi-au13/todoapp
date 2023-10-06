// const Todo = require("../models/todo");

// const createTodo = async (req, res) => {
//   // Implement create todo logic
//   try {
//     const createTodo = new Todo(req.body);
//     await createTodo.save();
//     res.status(201).json({ message: "todo is successfully created" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getTodos = async (req, res) => {
//   // Implement get todos logic
//   try {
//     const getTodo = await Todo.find();

//     res.status(201).json(getTodo);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getTodo = async (req, res) => {
//   // Implement get todo by id logic
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (todo == null) {
//       return res.status(404).json({ message: "Todo not found" });
//     }
//     // res.todo = todo;
//     res.status(200).json(todo);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// const updateTodo = async (req, res) => {
//   // Implement update todo logic
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (todo == null) {
//       return res.status(404).json({ message: "Todo not found" });
//     }

//     if (req.body.title != null) {
//       todo.title = req.body.title; //student.name="ramesh"
//     }
//     if (req.body.description != null) {
//       todo.description = req.body.description; //student.name="ramesh"
//     }
//     if (req.body.completed != null) {
//       todo.description = req.body.description; //student.name="ramesh"
//     }
//     // res.todo = todo;
//     await todo.save();
//     res.status(201).json(todo);
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// const deleteTodo = async (req, res) => {
//   // Implement delete todo logic
//   try {
//     const deletedTodo = await Todo.deleteOne({ _id: req.params.id });

//     if (deletedTodo.deletedCount === 0) {
//       return res.status(404).json({ message: "Todo not found" });
//     }
//     res.json({ message: "Deleted Todo" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   createTodo,
//   getTodos,
//   getTodo,
//   updateTodo,
//   deleteTodo,
// };
const Todo = require("../models/todo");

// Create a new to-do item
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id; // Access the authenticated user's ID from the request
    console.log("request.user-controller", req.user);
    // Create a new to-do item
    const newTodo = new Todo({ title, description, user: userId });
    console.log("newTodo-controller", newTodo);

    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all to-do items for the authenticated user
const getTodos = async (req, res) => {
  try {
    const userId = req.user._id; // Access the authenticated user's ID from the request

    const page = parseInt(req.query.page) || 1; // Current page number (default to 1)
    const perPage = parseInt(req.query.perPage) || 10; // Items per page (default to 10)

    // Calculate the number of items to skip based on the page number and items per page
    const skip = (page - 1) * perPage;

    // Find all to-do items for the user with pagination

    const todos = await Todo.find({ user: userId }).skip(skip).limit(perPage);
    // // Find all to-do items for the user
    // const todos = await Todo.find({ user: userId });

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Get a specific to-do item by ID
const getTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id; // Access the authenticated user's ID from the request

    // Find the to-do item by ID and ensure it belongs to the user
    const todo = await Todo.findOne({ _id: todoId, user: userId });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Update a to-do item by ID
const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id; // Access the authenticated user's ID from the request

    // Find and update the to-do item by ID and ensure it belongs to the user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Delete a to-do item by ID
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id; // Access the authenticated user's ID from the request

    // Find and delete the to-do item by ID and ensure it belongs to the user
    const deletedTodo = await Todo.findOneAndDelete({
      _id: todoId,
      user: userId,
    });
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send(); // No content (successful deletion)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
};
