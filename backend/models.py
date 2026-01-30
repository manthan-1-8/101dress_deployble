from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
import enum

class ItemStatus(str, enum.Enum):
    LIVE = "live"
    PROCESSING = "processing"
    RENTED = "rented"
    AWAITING_PICKUP = "awaiting_pickup"

class OrderStatus(str, enum.Enum):
    ACTIVE_RENTAL = "active_rental"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    DISPUTE = "dispute"
    CLOSED = "closed"

class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)
    name: str
    trust_score: int = Field(default=100)
    wallet_balance: float = Field(default=0.0)
    escrow_balance: float = Field(default=0.0)
    avatar: Optional[str] = None

class User(UserBase, table=True):
    id: str = Field(default=None, primary_key=True)
    hashed_password: str
    
    items: List["Item"] = Relationship(back_populates="seller")
    buyer_orders: List["Order"] = Relationship(back_populates="buyer", sa_relationship_kwargs={"foreign_keys": "Order.buyer_id"})
    seller_orders: List["Order"] = Relationship(back_populates="seller", sa_relationship_kwargs={"foreign_keys": "Order.seller_id"})

class UserCreate(SQLModel):
    email: str
    password: str
    name: str

class UserRead(UserBase):
    id: str

class Token(SQLModel):
    access_token: str
    token_type: str

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    category: str
    brand: str
    size: str
    condition: str
    type: str # sale, rent, both
    sale_price: Optional[float] = None
    rent_price: Optional[float] = None
    deposit: Optional[float] = None
    image: str
    status: ItemStatus = Field(default=ItemStatus.LIVE)
    verified: bool = Field(default=False)
    
    seller_id: str = Field(foreign_key="user.id")
    seller: User = Relationship(back_populates="items")
    orders: List["Order"] = Relationship(back_populates="item")

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    item_id: int = Field(foreign_key="item.id")
    buyer_id: str = Field(foreign_key="user.id")
    seller_id: str = Field(foreign_key="user.id")
    type: str # buy, rent
    status: OrderStatus = Field(default=OrderStatus.SHIPPED)
    days_remaining: Optional[int] = None
    deposit_locked: Optional[float] = None
    escrow_amount: float
    action_required: Optional[str] = None
    
    item: Item = Relationship(back_populates="orders")
    buyer: User = Relationship(back_populates="buyer_orders", sa_relationship_kwargs={"foreign_keys": "Order.buyer_id"})
    seller: User = Relationship(back_populates="seller_orders", sa_relationship_kwargs={"foreign_keys": "Order.seller_id"})
