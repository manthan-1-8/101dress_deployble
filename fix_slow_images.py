import sqlite3

db_path = 'backend/database_v2.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Map likely titles/brands to local assets
# Using the list of files I saw earlier
updates = {
    'Acne': '/assets/items/acne-jacket.png', # specific match
    'Zimmermann': '/assets/ysl_sunset.png', # fallback
    'Prada': '/assets/prada_cleo.png',
    'YSL': '/assets/ysl_sunset.png',
    'Gucci': '/assets/gucci_belt.png',
    'Balenciaga': '/assets/balenciaga_sneakers.png'
}

print("Checking items...")
cursor.execute("SELECT id, title, image FROM item")
items = cursor.fetchall()

for item_id, title, current_image in items:
    new_image = None
    
    # Simple keyword matching
    for key, path in updates.items():
        if key.lower() in title.lower():
            new_image = path
            break
            
    # If it's an unsplash URL and we have no match, use a random local one to ensure speed
    if not new_image and "unsplash" in current_image:
         new_image = '/assets/prada_cleo.png' # Default fallback
         
    if new_image and new_image != current_image:
        print(f"Updating '{title}' \n  Old: {current_image}\n  New: {new_image}")
        cursor.execute("UPDATE item SET image = ? WHERE id = ?", (new_image, item_id))

conn.commit()
print("Done. All remote images should now be local.")
conn.close()
