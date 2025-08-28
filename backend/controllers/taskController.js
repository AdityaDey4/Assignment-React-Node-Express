const tasksByUser = new Map();
let taskIdCounter = 1;

const ensureUserList = (userId) => {
  if (!tasksByUser.has(userId)) tasksByUser.set(userId, []);
  return tasksByUser.get(userId);
};


export const getTasks = (req, res) => {
  const list = ensureUserList(req.user.id);
  res.json(list);
};

export const addTask = (req, res) => {
  const { title, status } = req.body || {};
  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const allowed = ["pending", "completed"];
  const st = status && allowed.includes(status) ? status : "pending";

  const list = ensureUserList(req.user.id);
  const newTask = { id: taskIdCounter++, title: String(title).trim(), status: st };
  list.push(newTask);
  res.status(201).json(newTask);
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const allowed = ["pending", "completed"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Status must be "pending" or "completed"' });
  }
  const list = ensureUserList(req.user.id);
  const task = list.find((t) => t.id === Number(id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.status = status;
  res.json(task);
};

export const deleteTask = (req, res) => {
  const list = ensureUserList(req.user.id);
  const idx = list.findIndex((t) => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Task not found" });
  const [removed] = list.splice(idx, 1);
  res.json(removed);
};
