from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()


def get_uuid():
    return uuid4().hex


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True,
                   unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)


class Stock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10))
    interval = db.Column(db.String(10))
    currency = db.Column(db.String(5))
    exchange_timezone = db.Column(db.String(50))
    exchange = db.Column(db.String(50))
    mic_code = db.Column(db.String(10))
    type = db.Column(db.String(20))
    values = db.relationship('StockValue', backref='stock', lazy=True)


class StockValue(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stock_id = db.Column(db.Integer, db.ForeignKey('stock.id'), nullable=False)
    datetime = db.Column(db.String(20))
    open = db.Column(db.Float)
    high = db.Column(db.Float)
    low = db.Column(db.Float)
    close = db.Column(db.Float)
    volume = db.Column(db.Integer)


class WatchList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10))
