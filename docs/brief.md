# Project: YouTube Channel Chat App

## What is this project?

This project is an application to **chat with YouTube channels**. Users can select from a **predefined list of available channels** (no manual input required). All videos within the selected channel will be processed to extract transcripts. These transcripts will then be stored as vector embeddings, enabling users to query them in a chat-like format. For example, a user can ask: *“What does this channel say about AI?”* and the system will respond with references from the channel’s videos.

In addition, chat conversations with the channel can be expanded into more detailed knowledge, such as topic summaries, glossaries, or additional Q\&A pairs.

---

## Key Features

1. **Channel List** – Users choose from a predefined list of available channels.
2. **Transcript Crawling** – The system automatically extracts transcripts from all videos in the selected channel.
3. **Vector Store** – Transcripts are converted into embeddings and stored.
4. **Chat QA** – Users can query the channel’s content and receive answers with timestamp references.
5. **Deep Link to YouTube** – Answers include links to specific moments in the videos.
6. **Knowledge Expansion** – Conversations can be processed into topic summaries, glossaries, or Q\&A pairs.
7. **Incremental Sync** – Newly uploaded videos are automatically crawled and indexed.

---

## Next Steps for Pages (MD)

* **Landing Page**: Brief description of what the app does.
* **Chat Page**: Chat area + channel selection + list of videos + deep link buttons.
* **Dashboard (Admin)**: Monitor crawling, indexing, and embedding costs.
* **Knowledge Page**: Display topic summaries, Q\&A pairs, and glossaries.
