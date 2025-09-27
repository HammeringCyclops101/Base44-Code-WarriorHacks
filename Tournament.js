{
  "name": "Tournament",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Tournament name"
    },
    "description": {
      "type": "string",
      "description": "Tournament description"
    },
    "created_by": {
      "type": "string",
      "description": "Creator's email"
    },
    "start_date": {
      "type": "string",
      "format": "date-time",
      "description": "Tournament start time"
    },
    "end_date": {
      "type": "string",
      "format": "date-time",
      "description": "Tournament end time"
    },
    "max_participants": {
      "type": "number",
      "description": "Maximum number of participants"
    },
    "challenge_ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of challenge IDs in this tournament"
    },
    "participants": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of participant emails"
    },
    "status": {
      "type": "string",
      "enum": [
        "upcoming",
        "active",
        "completed"
      ],
      "default": "upcoming",
      "description": "Tournament status"
    },
    "prize_description": {
      "type": "string",
      "description": "Prize or recognition description"
    }
  },
  "required": [
    "title",
    "created_by",
    "start_date",
    "end_date"
  ]
}
