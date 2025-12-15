# Arogya Wellness Assistant

**Arogya Wellness Assistant** is a full-stack, multi-agent health and wellness assistant.  
The backend (Flask + LangChain + Groq Llama‑3.3‑70B‑Versatile) coordinates specialized agents for symptoms, lifestyle, diet, and fitness, then synthesizes a **safe wellness plan**.
The frontend (React + Vite) provides a guided experience for login, profile management, wellness queries, and follow-up questions.



## Core Features

### Multi-Agent Wellness Pipeline
- **Symptom Triage Agent** – identifies general wellness concerns (non-diagnostic)
- **Lifestyle Guidance Agent** – sleep, routine, stress-related advice
- **Diet & Nutrition Agent** – food and hydration guidance
- **Fitness & Activity Agent** – low-intensity, safety-first movement suggestions

### Shared Conversational Memory
- Short-term memory shared between agents during orchestration  
- Ensures agents are context-aware of each other’s outputs

### Structured Orchestration Output
The orchestrator combines all agent outputs into a single structured JSON response:

- `synthesized_guidance` – markdown wellness plan with:
  - Overview  
  - When to See a Doctor  
  - Lifestyle & Rest  
  - Hydration & Diet  
  - Hygiene & Environment  
  - Movement & Activity  
  - Final Note  
- `recommendations` – concise bullet-point takeaways  
- Raw agent outputs:
  - `symptom_analysis`
  - `lifestyle`
  - `diet`
  - `fitness`

### Follow-up Q&A
- Users can ask follow-up questions after receiving a wellness plan  
- Backend uses the **last stored plan + recommendations** as context  
- Ensures continuity and safer responses

### Frontend Experience
- Username/password login (demo JSON-based store)  
- Profile management:
  - height
  - weight
  - medications  


***

## Tech Stack

### Backend
- Python 3.11  
- Flask (REST API, routing, error handling)  
- LangChain (core abstractions, messages, memory)  
- `groq` + `langchain-groq` / `langchain_openai` style Groq integration
- **Model:** `llama-3.3-70b-versatile` on GroqCloud
- Shared conversation buffer memory  
- JSON-file data storage:
  - User credentials 
  - User profiles
  - Session & orchestration history

### Frontend
- React + Vite  
- Axios for API communication  
- `react-markdown` for rendering markdown responses  
- Custom CSS for:
  - Cards
  - Navbar
  - Buttons
  - Responsive layout

### Configuration & Security
- Environment variables using `.env`  
- Groq API key & model configuration  
  - `GROQ_API_KEY`  
  - `GROQ_MODEL_NAME=llama-3.3-70b-versatile`  
- Username/password authentication via `/login`  
- CORS enabled for local development

***

## API Endpoints

### Authentication

**POST** `/login`  
Body:
```json
{
  "username": "user1",
  "password": "password"
}
```

### Health Assistance

**POST** `/health-assist`  

```json
{
  "symptoms": "fever and headache",
  "medical_report": ""
}
```

### Recommendations Only

**POST** `/recommendations`  
Returns only the recommendations in points.

### Follow-Up Questions

**POST** `/follow-up`  

Body:
```json
{
  "question": "Can I exercise lightly with these symptoms?"
}
```

***

## Running the Project

### Backend Setup

```bash
# from repo root (backend at root)
pip install -r requirements.txt
```

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL_NAME=llama-3.3-70b-versatile
```

Run the Flask app:

```bash
python app.py
```

Backend runs at:  
`http://127.0.0.1:5000`

### Frontend Setup

If frontend is in `wellness-frontend/`:

```bash
cd wellness-frontend
npm install
npm run dev
```

Frontend runs at:  
`http://127.0.0.1:5173`
