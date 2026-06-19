"""
ImageKit Uploader
-----------------
Uploads a PIL Image to ImageKit and returns a publicly accessible URL.
ImageKit gives 20 GB bandwidth / month on the free tier – plenty for dev/staging.

Dashboard → https://imagekit.io/dashboard
Docs     → https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload
"""

import os
import io
import base64
import httpx
from PIL import Image
from dotenv import load_dotenv

load_dotenv()


class ImageKitUploader:
    def __init__(self):
        self.private_key  = os.getenv("IMAGEKIT_PRIVATE_KEY", "")
        self.url_endpoint = os.getenv("IMAGEKIT_URL_ENDPOINT", "")
        self.upload_url   = "https://upload.imagekit.io/api/v1/files/upload"

    def _is_configured(self) -> bool:
        return bool(self.private_key and self.url_endpoint)

    def upload_pil_image(self, img: Image.Image, filename: str = "product.jpg") -> str:
        """
        Upload a PIL image to ImageKit.
        Returns the public CDN URL, or raises RuntimeError on failure.
        """
        if not self._is_configured():
            raise RuntimeError(
                "ImageKit is not configured. "
                "Please set IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT in your .env file."
            )

        # Convert image to JPEG bytes
        if img.mode != "RGB":
            img = img.convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=90)
        image_bytes = buf.getvalue()

        # ImageKit auth uses HTTP Basic with private key as username (no password)
        auth = (self.private_key, "")

        response = httpx.post(
            self.upload_url,
            auth=auth,
            data={
                "fileName": filename,
                "folder": "/verion-ai/products",
                "useUniqueFileName": "true",
            },
            files={"file": (filename, image_bytes, "image/jpeg")},
            timeout=30,
        )

        if response.status_code != 200:
            raise RuntimeError(f"ImageKit upload failed [{response.status_code}]: {response.text}")

        return response.json()["url"]

    def upload_multiple(self, images: list[Image.Image]) -> list[str]:
        """Upload a list of PIL images and return a list of public URLs."""
        urls = []
        for i, img in enumerate(images):
            url = self.upload_pil_image(img, filename=f"product_{i+1}.jpg")
            urls.append(url)
        return urls
