# settings_routes.py
from flask import Blueprint, request, jsonify
from app import mongo

settings_routes = Blueprint('settings_routes', __name__)

# Your settings CRUD routes go here...
