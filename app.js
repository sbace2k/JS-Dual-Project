import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { getUsers, getUser, getUserByEmail, getTasks, createTask, updateTaskStatus, deleteTask, clearCompletedTasks, createUser } from './database.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname)))
app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await getUsers()
    res.send(users)
})

app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    const user = await getUser(id)
    res.send(user)
})

app.post('/users', async (req, res) => {
    const { name, email, password } = req.body
    const user = await createUser(name, email, password)
    res.status(201).send(user)
})

app.get('/tasks', async (req, res) => {
    const { user_id } = req.query
    if (!user_id) {
      return res.status(400).send('Missing user_id')
    }

    const tasks = await getTasks(user_id)
    res.send(tasks)
})

app.post('/tasks', async (req, res) => {
    const { user_id, task, deadline } = req.body
    if (!user_id || !task) {
      return res.status(400).send('Missing user_id or task')
    }

    const created = await createTask(user_id, task, deadline)
    res.status(201).send(created)
})

app.patch('/tasks/:id', async (req, res) => {
    const { id } = req.params
    const { done } = req.body
    if (done === undefined) {
      return res.status(400).send('Missing done status')
    }

    await updateTaskStatus(id, done)
    res.sendStatus(204)
})

app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params
    await deleteTask(id)
    res.sendStatus(204)
})

app.delete('/tasks', async (req, res) => {
    const { user_id } = req.query
    if (!user_id) {
      return res.status(400).send('Missing user_id')
    }

    await clearCompletedTasks(user_id)
    res.sendStatus(204)
})

app.post('/auth/login', async (req, res) => {
    const { identifier, password } = req.body
    if (!identifier || !password) {
      return res.status(400).send('Email and password are required.')
    }

    const user = await getUserByEmail(identifier)
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid email or password.')
    }

    const { password: _, ...safeUser } = user
    res.send(safeUser)
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3001, () => {
    console.log('Server is running on port 3001')
})