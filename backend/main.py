from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine, select
from typing import List
from .models import User, Item, Order, ItemStatus

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///backend/{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

app = FastAPI(title="101 Dress API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to 101 Dress API. Visit /docs for API documentation."}

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Seed initial data if needed
    with Session(engine) as session:
        if not session.exec(select(User)).first():
            mock_user = User(
                id="u1",
                name="Alex Rivera",
                trust_score=92,
                wallet_balance=45000,
                escrow_balance=12500,
                avatar="https://i.pravatar.cc/150?u=u1"
            )
            session.add(mock_user)
            
            items = [
                Item(title="Acne Studios Leather Jacket", category="Jackets", brand="Acne Studios", size="M", condition="A", type="both", sale_price=28500, rent_price=1500, deposit=8000, image="https://images.unsplash.com/photo-1551028919-ac76c9085918?auto=format&fit=crop&q=80&w=1000", seller_id="u1", verified=True),
                Item(title="Zimmermann Silk Dress", category="Dresses", brand="Zimmermann", size="S", condition="A", type="rent", rent_price=3200, deposit=10000, image="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=1000", seller_id="u1", verified=True)
            ]
            for item in items:
                session.add(item)
            session.commit()

@app.get("/api/items", response_model=List[Item])
def read_items(session: Session = Depends(get_session)):
    return session.exec(select(Item)).all()

@app.get("/api/items/{item_id}", response_model=Item)
def read_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/api/items", response_model=Item)
def create_item(item: Item, session: Session = Depends(get_session)):
    session.add(item)
    session.commit()
    session.refresh(item)
    return item

@app.get("/api/users/{user_id}", response_model=User)
def read_user(user_id: str, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/orders", response_model=List[Order])
def read_orders(user_id: str, session: Session = Depends(get_session)):
    return session.exec(select(Order).where((Order.buyer_id == user_id) | (Order.seller_id == user_id))).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
