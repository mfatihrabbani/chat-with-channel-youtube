# YouTube Channel Chat App - API Structure

This document outlines the API structure for the YouTube Channel Chat App, including endpoints, request/response formats, and authentication.

## API Overview

The API is organized into several resource groups:
1. Channels API - Manage YouTube channels
2. Chat API - Handle chat interactions
3. Knowledge API - Retrieve and manage knowledge artifacts
4. Admin API - Administrative functions
5. Processing API - Background job management

## Base URL

```
/api/v1/
```

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": null
}
```

For errors:
```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "errors": ["Detailed error information"]
}
```

## 1. Channels API

### 1.1. Get All Channels

Retrieve a list of all available channels.

**Endpoint:** `GET /channels`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "youtube_channel_id": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
      "title": "Google Developers",
      "description": "The official Google Developers channel...",
      "thumbnail_url": "https://yt3.ggpht.com/...",
      "custom_url": "googledevelopers",
      "video_count": 450,
      "total_duration": "120:30:00",
      "processing_status": "completed",
      "last_synced_at": "2023-10-15T10:30:00Z"
    }
  ],
  "message": "Channels retrieved successfully"
}
```

### 1.2. Get Channel Details

Retrieve detailed information about a specific channel.

**Endpoint:** `GET /channels/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "youtube_channel_id": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
    "title": "Google Developers",
    "description": "The official Google Developers channel...",
    "thumbnail_url": "https://yt3.ggpht.com/...",
    "custom_url": "googledevelopers",
    "video_count": 450,
    "total_duration": "120:30:00",
    "processing_status": "completed",
    "last_synced_at": "2023-10-15T10:30:00Z",
    "recent_videos": [
      {
        "id": "uuid",
        "youtube_video_id": "dQw4w9WgXcQ",
        "title": "Video Title",
        "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
        "published_at": "2023-10-10T10:30:00Z",
        "duration": "10:30",
        "view_count": 1000000,
        "transcript_status": "available",
        "embedding_status": "completed"
      }
    ]
  },
  "message": "Channel details retrieved successfully"
}
```

### 1.3. Sync Channel

Trigger synchronization of a channel (fetch new videos and process them).

**Endpoint:** `POST /channels/{id}/sync`

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "pending",
    "message": "Channel synchronization started"
  },
  "message": "Sync job created successfully"
}
```

### 1.4. Get Channel Videos

Retrieve videos for a specific channel with pagination.

**Endpoint:** `GET /channels/{id}/videos`

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `sort` (string, default: "published_at") - Sort field
- `order` (string, default: "desc") - Sort order

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "uuid",
        "youtube_video_id": "dQw4w9WgXcQ",
        "title": "Video Title",
        "description": "Video description...",
        "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
        "published_at": "2023-10-10T10:30:00Z",
        "duration": "10:30",
        "view_count": 1000000,
        "like_count": 50000,
        "transcript_status": "available",
        "embedding_status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 450,
      "pages": 23
    }
  },
  "message": "Videos retrieved successfully"
}
```

## 2. Chat API

### 2.1. Create Conversation

Start a new conversation with a channel.

**Endpoint:** `POST /chat/conversations`

**Request:**
```json
{
  "channel_id": "uuid",
  "session_id": "optional-session-identifier"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "channel_id": "uuid",
    "session_id": "optional-session-identifier",
    "created_at": "2023-10-15T10:30:00Z",
    "messages": []
  },
  "message": "Conversation created successfully"
}
```

### 2.2. Get Conversation

Retrieve a conversation with its messages.

**Endpoint:** `GET /chat/conversations/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "channel_id": "uuid",
    "channel_title": "Google Developers",
    "session_id": "optional-session-identifier",
    "created_at": "2023-10-15T10:30:00Z",
    "updated_at": "2023-10-15T11:30:00Z",
    "messages": [
      {
        "id": "uuid",
        "role": "user",
        "content": "What is this channel about?",
        "references": null,
        "created_at": "2023-10-15T10:35:00Z"
      },
      {
        "id": "uuid",
        "role": "assistant",
        "content": "This channel is about Google's developer products and technologies...",
        "references": {
          "video_id": "uuid",
          "youtube_video_id": "dQw4w9WgXcQ",
          "video_title": "Google I/O 2023 Keynote",
          "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
          "segments": [
            {
              "transcript_id": "uuid",
              "start_time": "00:05:30",
              "end_time": "00:06:15",
              "text": "Google I/O is our annual developer conference...",
              "relevance_score": 0.95
            }
          ]
        },
        "created_at": "2023-10-15T10:36:00Z"
      }
    ]
  },
  "message": "Conversation retrieved successfully"
}
```

### 2.3. Send Message

Send a message in a conversation and get an AI response.

**Endpoint:** `POST /chat/conversations/{id}/messages`

**Request:**
```json
{
  "content": "What does this channel say about AI?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_message": {
      "id": "uuid",
      "role": "user",
      "content": "What does this channel say about AI?",
      "references": null,
      "created_at": "2023-10-15T10:40:00Z"
    },
    "assistant_message": {
      "id": "uuid",
      "role": "assistant",
      "content": "This channel covers various aspects of AI including machine learning, TensorFlow, and Google's AI products...",
      "references": {
        "video_id": "uuid",
        "youtube_video_id": "dQw4w9WgXcQ",
        "video_title": "Introduction to TensorFlow",
        "thumbnail_url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
        "segments": [
          {
            "transcript_id": "uuid",
            "start_time": "00:02:15",
            "end_time": "00:03:45",
            "text": "TensorFlow is an open source machine learning framework...",
            "relevance_score": 0.92
          },
          {
            "transcript_id": "uuid",
            "start_time": "00:15:30",
            "end_time": "00:16:20",
            "text": "Google's AI research focuses on making AI helpful for everyone...",
            "relevance_score": 0.88
          }
        ]
      },
      "created_at": "2023-10-15T10:41:00Z"
    }
  },
  "message": "Message sent and response generated successfully"
}
```

### 2.4. Get User Conversations

Retrieve all conversations for a user or session.

**Endpoint:** `GET /chat/conversations`

**Query Parameters:**
- `session_id` (string) - Session identifier for anonymous users
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "channel_id": "uuid",
        "channel_title": "Google Developers",
        "session_id": "optional-session-identifier",
        "created_at": "2023-10-15T10:30:00Z",
        "updated_at": "2023-10-15T11:30:00Z",
        "message_count": 5,
        "last_message": "What does this channel say about AI?"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  },
  "message": "Conversations retrieved successfully"
}
```

## 3. Knowledge API

### 3.1. Get Channel Knowledge

Retrieve knowledge artifacts for a specific channel.

**Endpoint:** `GET /knowledge/channel/{channel_id}`

**Query Parameters:**
- `type` (string, optional) - Filter by type (summary, glossary, qa_pair)
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "knowledge": [
      {
        "id": "uuid",
        "type": "summary",
        "title": "Machine Learning Overview",
        "content": "This channel covers various aspects of machine learning including supervised learning, unsupervised learning, and deep learning...",
        "metadata": {
          "topic": "Machine Learning",
          "video_count": 15,
          "related_videos": ["uuid1", "uuid2"],
          "confidence_score": 0.85
        },
        "created_at": "2023-10-15T10:30:00Z",
        "updated_at": "2023-10-15T11:30:00Z"
      },
      {
        "id": "uuid",
        "type": "glossary",
        "title": "AI Terminology",
        "content": "Key terms and definitions related to artificial intelligence and machine learning",
        "metadata": {
          "terms": [
            {
              "term": "Neural Network",
              "definition": "A computational model inspired by the human brain...",
              "context": "Neural networks are fundamental to deep learning",
              "video_references": ["uuid1", "uuid2"]
            }
          ]
        },
        "created_at": "2023-10-15T09:30:00Z",
        "updated_at": "2023-10-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    }
  },
  "message": "Knowledge retrieved successfully"
}
```

### 3.2. Generate Knowledge

Trigger knowledge generation from conversations.

**Endpoint:** `POST /knowledge/generate`

**Request:**
```json
{
  "channel_id": "uuid",
  "conversation_ids": ["uuid1", "uuid2"],
  "type": "summary" // summary, glossary, or qa_pair
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "pending",
    "message": "Knowledge generation started"
  },
  "message": "Knowledge generation job created successfully"
}
```

## 4. Admin API

### 4.1. Get System Status

Retrieve system status and metrics.

**Endpoint:** `GET /admin/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "channels": {
      "total": 10,
      "active": 8,
      "processing": 2
    },
    "videos": {
      "total": 4500,
      "with_transcripts": 4200,
      "with_embeddings": 4100
    },
    "conversations": {
      "total": 1250,
      "today": 45
    },
    "processing_jobs": {
      "pending": 5,
      "processing": 3,
      "completed": 1242,
      "failed": 12
    },
    "usage_metrics": {
      "today": {
        "requests": 1250,
        "tokens_used": 245000,
        "cost": 4.90
      },
      "this_month": {
        "requests": 37500,
        "tokens_used": 7350000,
        "cost": 147.00
      }
    }
  },
  "message": "System status retrieved successfully"
}
```

### 4.2. Get Processing Jobs

Retrieve processing jobs with filtering and pagination.

**Endpoint:** `GET /admin/jobs`

**Query Parameters:**
- `job_type` (string, optional) - Filter by job type
- `status` (string, optional) - Filter by status
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "job_type": "channel_sync",
        "reference_id": "uuid",
        "status": "processing",
        "progress": 45,
        "error_message": null,
        "created_at": "2023-10-15T10:30:00Z",
        "started_at": "2023-10-15T10:31:00Z",
        "completed_at": null,
        "metadata": {
          "total_videos": 100,
          "processed_videos": 45,
          "new_videos": 5,
          "error_videos": 2
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "pages": 2
    }
  },
  "message": "Jobs retrieved successfully"
}
```

### 4.3. Get Usage Metrics

Retrieve usage metrics with filtering and aggregation.

**Endpoint:** `GET /admin/metrics`

**Query Parameters:**
- `start_date` (date, optional) - Start date for metrics
- `end_date` (date, optional) - End date for metrics
- `granularity` (string, default: "day") - Aggregation granularity (day, week, month)
- `api_endpoint` (string, optional) - Filter by API endpoint

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "date": "2023-10-15",
        "api_endpoint": "chat/conversations/{id}/messages",
        "request_count": 125,
        "tokens_used": 24500,
        "cost": 0.49
      }
    ],
    "summary": {
      "total_requests": 1250,
      "total_tokens": 245000,
      "total_cost": 4.90
    }
  },
  "message": "Usage metrics retrieved successfully"
}
```

### 4.4. Retry Failed Job

Retry a failed processing job.

**Endpoint:** `POST /admin/jobs/{id}/retry`

**Response:**
```json
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "status": "pending",
    "message": "Job retry initiated"
  },
  "message": "Job retry initiated successfully"
}
```

## 5. Processing API

### 5.1. Get Job Status

Retrieve the status of a processing job.

**Endpoint:** `GET /processing/jobs/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "job_type": "channel_sync",
    "reference_id": "uuid",
    "status": "processing",
    "progress": 45,
    "error_message": null,
    "created_at": "2023-10-15T10:30:00Z",
    "started_at": "2023-10-15T10:31:00Z",
    "completed_at": null,
    "metadata": {
      "total_videos": 100,
      "processed_videos": 45,
      "new_videos": 5,
      "error_videos": 2
    }
  },
  "message": "Job status retrieved successfully"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

## Rate Limiting

- **Public endpoints**: 100 requests per minute per IP
- **Authenticated endpoints**: 1000 requests per minute per user
- **Admin endpoints**: 5000 requests per minute per admin user

## Authentication

For protected endpoints, include the Authorization header:

```
Authorization: Bearer <api-key>
```

Admin endpoints require additional admin privileges.