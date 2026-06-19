from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid

from db.database import Base


class PlatformConnection(Base):
    """
    Stores OAuth tokens / API credentials for each platform a user connects.
    In a full SaaS product each row would also carry a `user_id` foreign key.
    """
    __tablename__ = "platform_connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform = Column(String(50), nullable=False, index=True)  # 'shopify' | 'amazon' | 'instagram'

    # Shopify fields
    shop_domain = Column(String(255), nullable=True)   # e.g. my-store.myshopify.com
    access_token = Column(Text, nullable=True)         # shpat_…

    # Amazon SP-API fields (Phase 2)
    amazon_client_id     = Column(Text, nullable=True)
    amazon_client_secret = Column(Text, nullable=True)
    amazon_refresh_token = Column(Text, nullable=True)
    amazon_marketplace_id = Column(String(50), nullable=True)

    # Generic / future platforms
    extra_config = Column(Text, nullable=True)   # JSON blob for extra fields

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
