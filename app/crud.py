from sqlalchemy.orm import Session
from models import Student
from typing import List, Dict, Any

def get_all_students(db: Session):
    """Get all students from the database"""
    return db.query(Student).all()

def upsert_student(db: Session, student_data: dict):
    """Create or update a student in the database"""
    student = db.query(Student).filter(Student.id == student_data.get("id")).first()
    if student:
        
        for key, value in student_data.items():
            setattr(student, key, value)
    else:
        
        student = Student(**student_data)
        db.add(student)
    
    db.commit()
    db.refresh(student)
    return student

def delete_student(db: Session, student_id: int):
    """Delete a student from the database"""
    student = db.query(Student).filter(Student.id == student_id).first()
    if student:
        db.delete(student)
        db.commit()
        return {"message": "Student deleted successfully"}
    return {"message": "Student not found"}

def get_student(db: Session, student_id: int):
    """Get a student by ID"""
    return db.query(Student).filter(Student.id == student_id).first()