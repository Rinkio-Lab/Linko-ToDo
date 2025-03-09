from app import db

class Theme(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dark_mode = db.Column(db.Boolean, default=False)
    follow_system = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dark_mode': self.dark_mode,
            'follow_system': self.follow_system
        }