import sqlite3
import os

db_path = 'backend/database_v2.db'
print(f"Checking {db_path}...")
if not os.path.exists(db_path):
    print("File does not exist!")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", tables)

for t in tables:
    table_name = t[0]
    cursor.execute(f"SELECT count(*) FROM {table_name}")
    count = cursor.fetchone()[0]
    print(f"Table {table_name}: {count} rows")

# Check Item table columns
if ('item',) in tables or ('Item',) in tables:
    t = 'item' if ('item',) in tables else 'Item'
    cursor.execute(f"PRAGMA table_info({t})")
    cols = cursor.fetchall()
    print(f"Columns in {t}:", [c[1] for c in cols])

conn.close()
