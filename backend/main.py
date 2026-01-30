from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, SQLModel, create_engine, select
from .models import User, Item, Order, ItemStatus, UserCreate, Token, UserRead

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

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        if not session.exec(select(User)).first():
            hashed_pw = get_password_hash("password123")
            mock_user = User(
                id="u1",
                email="alex@example.com",
                hashed_password=hashed_pw,
                name="Alex Rivera",
                trust_score=92,
                wallet_balance=45000,
                escrow_balance=12500,
                avatar="https://i.pravatar.cc/150?u=u1"
            )
            session.add(mock_user)
            
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
                    image="https://images.unsplash.com/photo-1551028917-a48010bd8f3b?q=80&w=1000", 
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
                    image="https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?q=80&w=1000", 
                    seller_id="u1", 
                    verified=True
                )
            ]
            for item in items:
                session.add(item)
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
def read_items(session: Session = Depends(get_session)):
    return session.exec(select(Item)).all()

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8001, reload=True)
