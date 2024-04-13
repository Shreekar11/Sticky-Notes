import { Client } from 'pg'
require('dotenv').config();

export const client = new Client(
    {
        host: "localhost" || process.env.HOST,
        user: "postgres" || process.env.USER,
        port: 5432,
        password: "Shreekar@11" || process.env.PASSWORD,
        database: "sticky-note-db" || process.env.DB,
        // ssl:{
        //     rejectUnauthorized:false
        // }
    }
)
client.connect()
    .then(() => {
        console.log("Connection successful");
    })
    .catch((r: any) => {
        console.log("Unable to connect", r)
    })