from app import db
from datetime import datetime

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    due_date = db.Column(db.DateTime, nullable=True)
    category = db.Column(db.String(50), nullable=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('todo.id'), nullable=True)
    repeat_type = db.Column(db.String(20), nullable=True)  # daily, weekly, monthly, custom
    repeat_interval = db.Column(db.Integer, nullable=True)  # 重复间隔
    repeat_until = db.Column(db.DateTime, nullable=True)  # 重复截止日期
    depends_on = db.Column(db.String(200), nullable=True)  # 依赖的任务ID，以逗号分隔
    
    # 建立父子任务关系
    subtasks = db.relationship('Todo', backref=db.backref('parent', remote_side=[id]), lazy='dynamic')
    
    def has_subtasks(self):
        return self.subtasks.count() > 0
    
    def is_blocked(self):
        if not self.depends_on:
            return False
        dependent_ids = [int(id_) for id_ in self.depends_on.split(',')]
        return any(Todo.query.get(id_) and not Todo.query.get(id_).completed for id_ in dependent_ids)
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'completed': self.completed,
            'created_at': self.created_at.isoformat(),
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'category': self.category
        }