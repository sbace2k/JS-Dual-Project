import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users')
    return rows
}

export async function getUser(user_id) {
    const [rows] = await pool.query(`
        SELECT * FROM users 
        WHERE user_id = ?
    `, [user_id])
    return rows[0]
}

export async function getUserByEmail(email) {
    const [rows] = await pool.query(`
        SELECT * FROM users
        WHERE email = ?
    `, [email])
    return rows[0]
}

export async function getTasks(user_id) {
    const [rows] = await pool.query(`
        SELECT * FROM tasks
        WHERE user_id = ?
        ORDER BY created_at ASC
    `, [user_id])
    return rows
}

export async function createTask(user_id, task, deadline) {
    const [result] = await pool.query(`
        INSERT INTO tasks (user_id, task, deadline)
        VALUES (?, ?, ?)
    `, [user_id, task, deadline || null])
    const taskId = result.insertId
    const [rows] = await pool.query(`
        SELECT * FROM tasks WHERE task_id = ?
    `, [taskId])
    return rows[0]
}

export async function updateTaskStatus(task_id, done) {
    await pool.query(`
        UPDATE tasks
        SET completed = ?
        WHERE task_id = ?
    `, [done ? 1 : 0, task_id])
}

export async function deleteTask(task_id) {
    await pool.query(`
        DELETE FROM tasks WHERE task_id = ?
    `, [task_id])
}

export async function clearCompletedTasks(user_id) {
    await pool.query(`
        DELETE FROM tasks
        WHERE user_id = ? AND completed = 1
    `, [user_id])
}

export async function createUser(name, email,password){
    const [result] = await pool.query(`
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `, [name, email, password])
    const id = result.insertId
    return getUser(id)
}

