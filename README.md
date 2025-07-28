# 🎮 ClipForge AI

**ClipForge AI** is a powerful, full-stack AI-powered short video generation platform built with Next.js. It allows users to generate creative short-form videos (like YouTube Shorts, Instagram Reels, etc.) by leveraging artificial intelligence for scripting, visuals, audio, captions, and rendering — all in a seamless workflow.

Whether you're a content creator, marketer, or business owner, **ClipForge AI** empowers you to go from idea to video in just a few clicks using the latest AI APIs and developer tools.

---

## ✨ Key Features

* ✍️ **AI-generated video scripts** using Gemini
* 🎨 **Dynamic visuals** sourced from Freepik and Flaticon
* 🎧 **Audio generation** and transcription with AssemblyAI
* 📝 **Automatic captions** extracted from text/audio
* 🔐 **Secure user authentication** with Clerk
* 📂 **Database-powered video management** with Neon + Drizzle
* 🌐 **Cloud-based APIs** for real-time content generation and storage
* 💡 **Modern, responsive UI** using Shadcn/ui & Lucide
* 🗃️ **Timeline-based video rendering** powered by Shotstack API

---

## 🧰 Technologies Used

### 👨‍💻 Frontend & Framework

* **Next.js**: Provides the core React-based framework, supporting server-side rendering, API routes, and routing for the application.
* Offers a fast, scalable, SEO-friendly foundation for the AI Shorts Generator platform.

---

### 🔐 Authentication

* **Clerk Auth**: Handles user sign-up, login, and session management with minimal setup.
* It provides secure and customizable authentication and user profile management, reducing boilerplate code drastically.

---

### 💃️ Database & ORM

* **Neon Database**: A serverless, scalable Postgres database that stores user data, script history, audio metadata, and video drafts.

* With its built-in branching and autoscaling, Neon ensures development and production workflows are separated and safe.

* **Drizzle ORM**: Used for schema declaration and type-safe SQL operations with the database.

* Allows easy, scalable database migrations and schema management fully integrated into the TypeScript codebase.

---

### 🧠 AI & ML Services

* **Gemini API (Google AI)**: Used to generate video scripts based on user prompts or ideas.

* With Gemini's state-of-the-art large language models, users get accurate, creative, and engaging scripts with minimal effort.

* **AssemblyAI**: Converts user-recorded or uploaded audio to text with high accuracy.

* Also used to analyze audio content for keyword detection, speaker identification, and real-time caption generation.

* **NEBIUS API**: This powerful rendering engine compiles all the elements — script, audio, visuals, and captions — into an exportable video.

* Helps in automating the final video production without requiring local video editing software.

* **Shotstack API**: A cloud-based video editing and rendering platform used to compile final videos from scenes, audio, images, and captions.

* Enables flexible video rendering with timeline-based editing, transitions, and export to MP4 — all done via API in the cloud.

---

### 🎨 Visual Assets

* **Freepik API**: Used to fetch relevant high-resolution illustrations and stock images based on script content.

* Helps users get relevant visuals that match the tone, style, and keywords of their video content.

* **Flaticon**: Provides access to animated and static icons, which are embedded into generated videos for visual emphasis.

* Offers a lightweight visual styling layer for engaging UI and video decoration.

* **Lucide**: A beautifully designed open-source icon library used throughout the UI.

* Helps maintain consistent iconography and supports light/dark mode beautifully.

---

### 💬 UI & UX

* **Shadcn/ui**: Provides elegant, accessible, and customizable React components to build a clean, modern user interface.
* Enables faster development while ensuring design consistency across modals, forms, buttons, selects, and more.

---

### ☁️ Backend Services & Cloud APIs

* **Supabase**: Used for cloud file storage, database backups, and real-time data syncing.

* It also acts as a backend layer for hosting assets like user-uploaded images, audio clips, or drafts.

* **Google Cloud API**: Powers various backend tasks like speech-to-text, text-to-speech, translation, and potential analytics in the pipeline.

* Ensures robust scalability and leverages Google’s AI infrastructure for faster processing.

---

## 📦 Installation

To run this project locally, clone the repo and install the dependencies:

```bash
git clone https://github.com/your-username/clipforge-ai.git
cd clipforge-ai
npm install
```

## Demo website photos
<img width="1911" height="1020" alt="image" src="https://github.com/user-attachments/assets/efda666d-54d5-4dba-889c-3f35a2e79e23" />
<img width="1919" height="1012" alt="image" src="https://github.com/user-attachments/assets/7e67c891-7593-40dd-b29a-13cbcdbd9b23" />
<img width="1919" height="1015" alt="image" src="https://github.com/user-attachments/assets/39a2997d-6a3f-4abf-aa3b-24644653dbfe" />
<img width="1914" height="1013" alt="image" src="https://github.com/user-attachments/assets/2283492a-4f34-479e-b411-30da3c09e63b" />






