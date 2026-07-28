from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import List
from datetime import datetime

router = APIRouter()

MOCK_RELEASES = [
    {
        "id": 1,
        "version": "v1.2.4",
        "target_device_type": "TEMP_SENSOR",
        "file_name": "smartbridge_fw_v1.2.4.bin",
        "file_size_bytes": 142856,
        "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "created_at": datetime.utcnow()
    }
]

@router.get("/releases")
async def list_firmware_releases():
    return MOCK_RELEASES

@router.post("/upload")
async def upload_firmware(
    version: str = Form(...),
    target_device_type: str = Form(...),
    file: UploadFile = File(...)
):
    content = await file.read()
    import hashlib
    sha256 = hashlib.sha256(content).hexdigest()

    release = {
        "id": len(MOCK_RELEASES) + 1,
        "version": version,
        "target_device_type": target_device_type,
        "file_name": file.filename,
        "file_size_bytes": len(content),
        "sha256_hash": sha256,
        "created_at": datetime.utcnow()
    }
    MOCK_RELEASES.append(release)
    return release

@router.post("/deploy")
async def trigger_ota_deployment(device_id: str, release_id: int):
    return {
        "status": "INITIATED",
        "device_id": device_id,
        "release_id": release_id,
        "message": f"OTA update sequence dispatched to node {device_id}"
    }
