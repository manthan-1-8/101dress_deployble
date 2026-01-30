import sqlite3
import os

db_path = 'backend/database_v2.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    new_path = '/assets/items/acne-jacket.png'
    title = 'Acne Studios Leather Jacket'
    cursor.execute("UPDATE item SET image = ? WHERE title = ?", (new_path, title))
    if cursor.rowcount > 0:
        print(f"Successfully updated image for '{title}' to '{new_path}'")
    else:
        print(f"No item found with title '{title}'")
    conn.commit()
    conn.close()
else:
    print("Database not found")
