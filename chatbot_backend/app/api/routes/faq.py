from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.db.models import FAQ
from app.schemas.faq import FAQCreate, FAQResponse, FAQUpdate
from app.services.faq_service import FAQService

router = APIRouter()
faq_service = FAQService()

@router.post("/", response_model=FAQResponse, status_code=status.HTTP_201_CREATED)
def create_faq(faq: FAQCreate, db: Session = Depends(get_db)):
    """Create a new FAQ entry"""
    return faq_service.create_faq(db, faq)

@router.get("/", response_model=List[FAQResponse])
def get_all_faqs(
    skip: int = 0, 
    limit: int = 100, 
    keyword: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all FAQ entries with optional keyword filtering"""
    return faq_service.get_faqs(db, skip, limit, keyword)

@router.get("/{faq_id}", response_model=FAQResponse)
def get_faq(faq_id: int, db: Session = Depends(get_db)):
    """Get a specific FAQ entry by ID"""
    faq = faq_service.get_faq_by_id(db, faq_id)
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return faq

@router.put("/{faq_id}", response_model=FAQResponse)
def update_faq(faq_id: int, faq_update: FAQUpdate, db: Session = Depends(get_db)):
    """Update an existing FAQ entry"""
    updated_faq = faq_service.update_faq(db, faq_id, faq_update)
    if not updated_faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return updated_faq

@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(faq_id: int, db: Session = Depends(get_db)):
    """Delete an FAQ entry"""
    success = faq_service.delete_faq(db, faq_id)
    if not success:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return None

@router.get("/search/{query}", response_model=List[FAQResponse])
def search_faqs(query: str, db: Session = Depends(get_db)):
    """Search FAQs by query string"""
    return faq_service.search_faqs(db, query)