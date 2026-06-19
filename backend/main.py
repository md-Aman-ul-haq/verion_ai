from fastapi import FastAPI, Form, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os
import io
import uuid
from PIL import Image
from pydantic import BaseModel

load_dotenv()

from orchestrator import Orchestrator
from db.database import get_db, init_db
from db import crud
from publishers.imagekit_uploader import ImageKitUploader
from publishers.shopify_publisher import ShopifyPublisher


# ── Lifespan (runs DB init on startup) ────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Verion AI",
    description="Privacy-First Multi-Agent Platform with Platform Integrations",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()
imagekit = ImageKitUploader()


# ── Schemas ────────────────────────────────────────────────────────────────────
class ShopifyConnectionRequest(BaseModel):
    shop_domain: str
    access_token: str


class PublishRequest(BaseModel):
    platform: str                      # 'shopify' | 'amazon'
    title: str
    description: str
    tags: List[str] = []
    price: str = "0.00"
    image_urls: List[str] = []         # already-uploaded ImageKit URLs
    vendor: str = "Verion AI"          # Store vendor
    quantity: Optional[int] = None     # Inventory units
    # ── Metafields from SEO agent ──
    color: Optional[str] = None
    condition: Optional[str] = None
    weight: Optional[str] = None
    brand: Optional[str] = None
    material: Optional[str] = None
    dimensions: Optional[str] = None
    category: Optional[str] = None
    product_type: str = ""
    specs: Optional[dict] = None       # Free-form spec k/v pairs


# ── Core Generate Route ────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"message": "Verion AI API is running"}


@app.post("/api/generate")
async def generate_listing(
    raw_description: str = Form(...),
    platform: str = Form("olx"),
    images: Optional[List[UploadFile]] = File(None),
):
    pil_images = []
    if images:
        for img_file in images:
            contents = await img_file.read()
            try:
                pil_images.append(Image.open(io.BytesIO(contents)))
            except Exception:
                pass

    result = orchestrator.process_request(
        raw_input=raw_description,
        images=pil_images if pil_images else None,
        platform=platform,
    )
    return result


# ── Image Upload Route (ImageKit) ──────────────────────────────────────────────
@app.post("/api/upload-images")
async def upload_images(images: List[UploadFile] = File(...)):
    """
    Upload images to ImageKit and return their public CDN URLs.
    Call this after generating a listing to get URLs ready for publishing.
    """
    pil_images = []
    for img_file in images:
        contents = await img_file.read()
        try:
            pil_images.append(Image.open(io.BytesIO(contents)))
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid image: {img_file.filename}")

    try:
        urls = imagekit.upload_multiple(pil_images)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    return {"status": "success", "image_urls": urls}


# ── Platform Connection Routes ─────────────────────────────────────────────────
@app.post("/api/connections/shopify")
async def connect_shopify(body: ShopifyConnectionRequest, db=Depends(get_db)):
    """Save (or update) Shopify credentials for this workspace."""
    # Verify the credentials work before saving
    publisher = ShopifyPublisher(body.shop_domain, body.access_token)
    if not publisher.test_connection():
        raise HTTPException(
            status_code=401,
            detail="Could not connect to Shopify. Please check your shop domain and access token.",
        )

    conn = await crud.upsert_connection(
        db,
        platform="shopify",
        shop_domain=body.shop_domain,
        access_token=body.access_token,
    )
    return {
        "status": "connected",
        "platform": "shopify",
        "shop_domain": conn.shop_domain,
        "id": str(conn.id),
    }


@app.get("/api/connections")
async def list_connections(db=Depends(get_db)):
    """List all saved platform connections (without exposing tokens)."""
    conns = await crud.list_connections(db)
    return [
        {
            "id": str(c.id),
            "platform": c.platform,
            "shop_domain": c.shop_domain,
            "connected_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in conns
    ]


@app.delete("/api/connections/{connection_id}")
async def delete_connection(connection_id: uuid.UUID, db=Depends(get_db)):
    deleted = await crud.delete_connection(db, connection_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Connection not found.")
    return {"status": "deleted"}


# ── Publish Route ──────────────────────────────────────────────────────────────
@app.post("/api/publish")
async def publish_listing(body: PublishRequest, db=Depends(get_db)):
    """
    Publish a generated listing to the specified platform.
    The listing data comes from a previous /api/generate call.
    """
    if body.platform == "shopify":
        conn = await crud.get_connection(db, "shopify")
        shop_domain = conn.shop_domain if conn else os.environ.get("SHOPIFY_SHOP_DOMAIN")
        access_token = conn.access_token if conn else os.environ.get("SHOPIFY_ACCESS_TOKEN")

        if not shop_domain or not access_token:
            raise HTTPException(
                status_code=404,
                detail="No Shopify connection found. Please connect your store or set env vars.",
            )

        publisher = ShopifyPublisher(shop_domain, access_token)
        try:
            result = publisher.publish_product(
                title=body.title,
                body_html=f"<p>{body.description}</p>",
                tags=body.tags,
                price=body.price,
                image_urls=body.image_urls,
                vendor=body.vendor,
                quantity=body.quantity,
                product_type=body.product_type,
                color=body.color,
                condition=body.condition,
                weight=body.weight,
                brand=body.brand,
                material=body.material,
                dimensions=body.dimensions,
                category=body.category,
                specs=body.specs,
            )
        except RuntimeError as e:
            raise HTTPException(status_code=502, detail=str(e))

        return {"status": "published", "platform": "shopify", "result": result}

    else:
        raise HTTPException(
            status_code=400,
            detail=f"Publishing to '{body.platform}' is not yet supported. Currently available: shopify",
        )
