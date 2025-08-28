import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

let users = []; 
let userIdCounter = 1;

const JWT_SECRET = "secret123";
export const loginOrCreate = async (req, res) => {
  const { name, password } = req.body || {};

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ error: "Name is required (min 3 chars)" });
  }
  if (!password || password.trim().length < 4) {
    return res.status(400).json({ error: "Password is required (min 4 chars)" });
  }

  let user = users.find((u) => u.name === name);

  if (user) {
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = {
      id: userIdCounter++,
      name: name.trim(),
      password: hashedPassword,
    };
    users.push(user);
  }

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({
    token,
    user: { id: user.id, name: user.name },
  });
};

export const getAllusers = async (req, res)=> {
  return res.json(users);
}