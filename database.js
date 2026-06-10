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

export async function createUser(name, email,password){
    const result = await pool.query(`
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `, [name, email, password])
    const id = result.insertId
    return getUser(id)
}

