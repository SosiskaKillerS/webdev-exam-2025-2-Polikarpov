import pytest
from database import engine
from sqlalchemy import text

def test_database_connection():
    """Test that we can connect to the database and execute a simple query."""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            assert result.scalar() == 1
    except Exception as e:
        pytest.fail(f"Database connection failed: {str(e)}")

def test_database_version():
    """Test that we can get PostgreSQL version."""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.scalar()
            assert "PostgreSQL" in version
            print(f"Connected to: {version}")
    except Exception as e:
        pytest.fail(f"Failed to get database version: {str(e)}")

if __name__ == "__main__":
    test_database_connection()
    test_database_version() 