from datetime import datetime, timedelta
from typing import List, Optional
import shutil
import os
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, SQLModel, create_engine, select
from .models import User, Item, Order, ItemStatus, UserCreate, Token, UserRead, OrderStatus

# --- RESPONSE MODELS ---
class OrderWithItem(SQLModel):
    id: int
    type: str
    status: str
    escrow_amount: float
    item: Item

# --- AUTH CONFIG ---
SECRET_KEY = "your-secret-key-for-dev-only"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600 # Long for dev

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# --- DATABASE CONFIG ---
sqlite_file_name = "database_v2.db" # Using v2 to avoid schema conflicts
sqlite_url = f"sqlite:///backend/{sqlite_file_name}"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# --- AUTH HELPERS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = session.exec(select(User).where(User.email == email)).first()
    if user is None:
        raise credentials_exception
    return user

# --- APP SETUP ---
app = FastAPI(title="101 Dress API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- STATIC FILES ---
# Ensure upload directory exists
UPLOAD_DIR = Path("frontend/public/assets/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount the static directory so uploaded files are accessible via URL
# Note: In production, you'd serve this via Nginx or S3, but for dev this works if frontend/public is served correctly
# Since Vite serves public folder at root /, we might not need this if we save directly there?
# But uploading via backend saves to disk. We need to tell backend where to save.
# Let's save to frontend/public so Vite sees it.

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    file_location = UPLOAD_DIR / file.filename
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    
    # Return absolute URL path relative to public folder for frontend consumption
    return {"url": f"/assets/uploads/{file.filename}"}


def fix_existing_images():
    """Migrate remote images to local assets for performance"""
    with Session(engine) as session:
        items = session.exec(select(Item)).all()
        updates = {
            "Acne": "/assets/items/acne-jacket.png",
            "Balenciaga": "/assets/balenciaga_sneakers.png",
            "Zimmermann": "/assets/ysl_sunset.png", # Fallback
            "Gucci": "/assets/gucci_belt.png",
            "Prada": "/assets/prada_cleo.png",
            "YSL": "/assets/ysl_sunset.png",
            "Chanel": "/assets/chanel_classic_flap.png"
        }
        for item in items:
            changed = False
            # Check for keyword matches
            for key, path in updates.items():
                if key.lower() in item.title.lower() and item.image != path:
                    item.image = path
                    changed = True
                    break
            
            # General fallback for any remaining unsplash links
            if not changed and "http" in item.image:
                item.image = "/assets/prada_cleo.png"
                changed = True
            
            if changed:
                session.add(item)
        session.commit()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    fix_existing_images()
    with Session(engine) as session:
        if not session.exec(select(User)).first():
            hashed_pw = get_password_hash("password123")
            mock_user = User(
                id="u1",
                email="alex@example.com",
                hashed_password=hashed_pw,
                name="Adhitya Chandel",
                trust_score=92,
                wallet_balance=45000,
                escrow_balance=12500,
                avatar="https://i.pravatar.cc/150?u=u1"
            )
            session.add(mock_user)
            
            # Seed another user for order logic
            seller_user = User(
                id="u2",
                email="sarah@example.com",
                hashed_password=hashed_pw,
                name="Sarah Jenkins",
                trust_score=98,
                wallet_balance=12000,
                escrow_balance=500,
                avatar="https://i.pravatar.cc/150?u=u2"
            )
            session.add(seller_user)
            
            items = [
                Item(
                    title="Acne Studios Leather Jacket", 
                    category="Jackets", 
                    brand="Acne Studios", 
                    size="M", 
                    condition="A", 
                    type="both", 
                    sale_price=28500, 
                    rent_price=1500, 
                    deposit=8000, 
                    image="/assets/items/acne-jacket.png", 
                    seller_id="u1", 
                    verified=True
                ),
                Item(
                    title="Zimmermann Silk Dress", 
                    category="Dresses", 
                    brand="Zimmermann", 
                    size="S", 
                    condition="A", 
                    type="rent", 
                    rent_price=3200, 
                    deposit=10000, 
                    image="/assets/ysl_sunset.png", 
                    seller_id="u1", 
                    verified=True
                ),
                Item(
                    title="Balenciaga Track Sneakers",
                    category="Sneakers",
                    brand="Balenciaga",
                    size="42",
                    condition="A",
                    type="sale",
                    sale_price=55000,
                    image="/assets/balenciaga_sneakers.png",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Prada Cleo Shoulder Bag",
                    category="Bags",
                    brand="Prada",
                    size="OS",
                    condition="S",
                    type="both",
                    sale_price=145000,
                    rent_price=5500,
                    deposit=25000,
                    image="/assets/prada_cleo.png",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Jacquemus Le Chiquito",
                    category="Bags",
                    brand="Jacquemus",
                    size="Mini",
                    condition="B",
                    type="sale",
                    sale_price=38000,
                    image="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1000",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Gucci GG Marmont Belt",
                    category="Accessories",
                    brand="Gucci",
                    size="90",
                    condition="A",
                    type="sale",
                    sale_price=22000,
                    image="/assets/gucci_belt.png",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Saint Laurent Sunset Bag",
                    category="Bags",
                    brand="Saint Laurent",
                    size="Medium",
                    condition="A",
                    type="rent",
                    rent_price=4500,
                    deposit=15000,
                    image="/assets/ysl_sunset.png",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Off-White Graphic Tee",
                    category="Tops",
                    brand="Off-White",
                    size="L",
                    condition="S",
                    type="sale",
                    sale_price=18500,
                    image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Burberry Trench Coat",
                    category="Jackets",
                    brand="Burberry",
                    size="48",
                    condition="A",
                    type="both",
                    sale_price=85000,
                    rent_price=6000,
                    deposit=20000,
                    image="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Dior Book Tote",
                    category="Bags",
                    brand="Dior",
                    size="Large",
                    condition="A",
                    type="both",
                    sale_price=210000,
                    rent_price=8000,
                    deposit=40000,
                    image="https://images.unsplash.com/photo-1544816153-12ad5d7132a1?q=80&w=1000",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Celine Triomphe Sunglasses",
                    category="Accessories",
                    brand="Celine",
                    size="OS",
                    condition="S",
                    type="sale",
                    sale_price=32000,
                    image="https://images.unsplash.com/photo-1511499767350-a1590fdb7351?q=80&w=1000",
                    seller_id="u1",
                    verified=True
                ),
                Item(
                    title="Hermes Oran Sandals",
                    category="Shoes",
                    brand="Hermes",
                    size="38",
                    condition="A",
                    type="sale",
                    sale_price=48000,
                    image="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000",
                    seller_id="u1",
                    verified=True
                ),
                # Item for u2 to sell and u1 to buy
                Item(
                    title="Chanel Classic Flap",
                    category="Bags",
                    brand="Chanel",
                    size="Medium",
                    condition="A",
                    type="sale",
                    sale_price=450000,
                    image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000",
                    seller_id="u2",
                    verified=True
                )
            ]
            
            # Need to add items first to get IDs? No, usually IDs are auto-generated.
            # But the objects are not flushed.
            # We can create order after session.commit() or flush.
            for item in items:
                session.add(item)
            session.flush() # Populate IDs
            
            # Seed an Order: u1 buys u2's item (last item)
            chanel_bag = items[-1]
            mock_order = Order(
                item_id=chanel_bag.id,
                buyer_id="u1",
                seller_id="u2",
                type="buy",
                status=OrderStatus.SHIPPED,
                escrow_amount=chanel_bag.sale_price,
                days_remaining=0
            )
            session.add(mock_order)
            
            session.commit()

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Welcome to 101 Dress API. Visit /docs for API documentation."}

@app.post("/api/auth/signup", response_model=UserRead)
def signup(user_data: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate unique ID for demo
    user_id = f"u{len(session.exec(select(User)).all()) + 1}"
    
    new_user = User(
        id=user_id,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        name=user_data.name,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/items", response_model=List[Item])
def read_items(seller_id: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Item).order_by(Item.id.desc())
    if seller_id:
        query = query.where(Item.seller_id == seller_id)
    return session.exec(query).all()

@app.get("/api/items/{item_id}", response_model=Item)
def read_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/api/items", response_model=Item)
def create_item(item: Item, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    item.seller_id = current_user.id
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@app.get("/api/users/me", response_model=UserRead)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/users/{user_id}", response_model=UserRead)
def read_user(user_id: str, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/orders", response_model=List[OrderWithItem])
def read_orders(user_id: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Order)
    if user_id:
        query = query.where(Order.buyer_id == user_id)
    orders = session.exec(query).all()
    # Explicitly ensure items are loaded if lazy (SQLModel usually handles this dynamically in memory if session is active)
    return orders

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)
