from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import Optional
import uuid

from db.models import PlatformConnection


async def upsert_connection(db: AsyncSession, platform: str, **kwargs) -> PlatformConnection:
    """
    Insert or update a platform connection.
    If a connection for `platform` already exists, update its credentials.
    """
    # Check for existing connection for this platform
    result = await db.execute(
        select(PlatformConnection).where(PlatformConnection.platform == platform)
    )
    existing = result.scalar_one_or_none()

    if existing:
        for key, value in kwargs.items():
            setattr(existing, key, value)
        conn = existing
    else:
        conn = PlatformConnection(platform=platform, **kwargs)
        db.add(conn)

    await db.commit()
    await db.refresh(conn)
    return conn


async def get_connection(db: AsyncSession, platform: str) -> Optional[PlatformConnection]:
    """Fetch the stored credentials for a given platform."""
    result = await db.execute(
        select(PlatformConnection).where(PlatformConnection.platform == platform)
    )
    return result.scalar_one_or_none()


async def list_connections(db: AsyncSession) -> list[PlatformConnection]:
    """Return all stored platform connections."""
    result = await db.execute(select(PlatformConnection))
    return result.scalars().all()


async def delete_connection(db: AsyncSession, connection_id: uuid.UUID) -> bool:
    """Remove a connection by its UUID. Returns True if a row was deleted."""
    result = await db.execute(
        delete(PlatformConnection).where(PlatformConnection.id == connection_id)
    )
    await db.commit()
    return result.rowcount > 0
