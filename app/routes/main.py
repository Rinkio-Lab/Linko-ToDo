from flask import Blueprint, jsonify, request, send_from_directory
from app import db
from app.models.todo import Todo
from datetime import datetime
import os

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    return send_from_directory(basedir, 'index.html')

@main_bp.route('/api/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.order_by(Todo.created_at.desc()).all()
    return jsonify([todo.to_dict() for todo in todos])

@main_bp.route('/api/todos', methods=['POST'])
def create_todo():
    data = request.get_json()
    new_todo = Todo(
        text=data['text'],
        priority=data.get('priority', 'medium'),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
        category=data.get('category')
    )
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.to_dict()), 201

@main_bp.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    data = request.get_json()
    
    todo.text = data.get('text', todo.text)
    todo.completed = data.get('completed', todo.completed)
    todo.priority = data.get('priority', todo.priority)
    todo.due_date = datetime.fromisoformat(data['due_date']) if data.get('due_date') else todo.due_date
    todo.category = data.get('category', todo.category)
    
    db.session.commit()
    return jsonify(todo.to_dict())

@main_bp.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    return '', 204

@main_bp.route('/api/todos/stats', methods=['GET'])
def get_stats():
    total_count = Todo.query.count()
    completed_count = Todo.query.filter_by(completed=True).count()
    active_count = total_count - completed_count
    completion_rate = (completed_count / total_count * 100) if total_count > 0 else 0
    
    return jsonify({
        'total': total_count,
        'completed': completed_count,
        'active': active_count,
        'completion_rate': round(completion_rate, 2)
    })