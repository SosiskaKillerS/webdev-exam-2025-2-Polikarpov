from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from alembic.config import Config
from alembic import command
import os

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1231@localhost:5434/kinoservice_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    
    try:
        alembic_ini_path = os.path.join(os.path.dirname(__file__), 'alembic.ini')
        alembic_cfg = Config(alembic_ini_path)
        command.upgrade(alembic_cfg, "head")
    except Exception as e:
        print(f"Warning: Failed to apply Alembic migrations: {e}")
        print("Continuing with SQLAlchemy table creation...")

init_db()