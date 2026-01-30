import sqlite3
import os

db_path = 'backend/database_v2.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT title, image FROM item")
    rows = cursor.fetchall()
    for row in rows:
        print(f"Title: {row[0]}, Image: {row[1]}")
    conn.close()
else:
    print("Database not found")
