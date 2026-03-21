import io
import uuid

import boto3
from botocore.exceptions import ClientError

from app.config import get_settings

settings = get_settings()


class StorageService:
    """S3/MinIO file upload service. Same boto3 client works for both."""

    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.S3_ENDPOINT_URL or None,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            region_name=settings.S3_REGION,
        )
        self.bucket = settings.S3_BUCKET_NAME

    def upload_file(
        self,
        file_content: bytes,
        filename: str,
        content_type: str = "image/jpeg",
        folder: str = "products",
    ) -> str:
        """Upload a file and return its public URL."""
        ext = filename.rsplit(".", 1)[-1] if "." in filename else "jpg"
        key = f"{folder}/{uuid.uuid4().hex}.{ext}"

        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=file_content,
            ContentType=content_type,
        )

        # Build URL
        if settings.S3_ENDPOINT_URL and "amazonaws.com" not in settings.S3_ENDPOINT_URL:
            # MinIO / local — path-style URL
            return f"{settings.S3_ENDPOINT_URL}/{self.bucket}/{key}"
        else:
            # AWS S3 — virtual-hosted style URL
            return f"https://{self.bucket}.s3.{settings.S3_REGION}.amazonaws.com/{key}"

    def delete_file(self, file_url: str) -> bool:
        """Delete a file by its URL."""
        try:
            # Extract key from URL
            if f"/{self.bucket}/" in file_url:
                key = file_url.split(f"/{self.bucket}/", 1)[1]
            elif ".amazonaws.com/" in file_url:
                key = file_url.split(".amazonaws.com/", 1)[1]
            else:
                return False

            self.client.delete_object(Bucket=self.bucket, Key=key)
            return True
        except (ClientError, IndexError):
            return False


def get_storage_service() -> StorageService:
    return StorageService()
