from factory.validation import Validator
from factory.database import Database

class Video(object):
    def __init__(self):
        self.validator = Validator()
        self.db = Database()

        self.collection_name = 'videos'

        self.fields = {
            "text": "string",
            "position": "string",
            "fontSize": "string",
        }

        self.create_required_fields = ["text"]
        self.create_optional_fields = []
        self.update_required_fields = ["text", "position", "fontSize"]
        self.update_optional_fields = []

    def create(self, video):
        self.validator.validate(video, self.fields, self.create_required_fields, self.create_optional_fields)
        res = self.db.insert(video, self.collection_name)
        return "Inserted Id " + res

    def find(self, video):  # find all
        return self.db.find(video, self.collection_name)

    def find_by_id(self, id):
        return self.db.find_by_id(id, self.collection_name)

    def update(self, id, video):
        self.validator.validate(video, self.fields, self.update_required_fields, self.update_optional_fields)
        return self.db.update(id, video, self.collection_name)  # Pass the collection_name here

    def delete(self, id):
        return self.db.delete(id, self.collection_name)
