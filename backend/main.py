from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.getenv("DB_PATH", "todos.db")
os.makedirs(os.path.dirname(os.path.abspath(DB_PATH)), exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Init DB schema
with get_db() as conn:
    conn.execute("""
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0
        )
    """)

class TodoCreate(BaseModel):
    title: str

class TodoUpdate(BaseModel):
    completed: bool

@app.get("/todos")
def list_todos():
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM todos ORDER BY id DESC").fetchall()
        return [dict(r) for r in rows]

@app.post("/todos")
def create_todo(todo: TodoCreate):
    with get_db() as conn:
        cur = conn.execute("INSERT INTO todos (title) VALUES (?)", (todo.title,))
        return {"id": cur.lastrowid, "title": todo.title, "completed": False}

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate):
    with get_db() as conn:
        conn.execute("UPDATE todos SET completed = ? WHERE id = ?", (todo.completed, todo_id))
        return {"id": todo_id, "completed": todo.completed}

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    with get_db() as conn:
        conn.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
        return {"status": "deleted"}
