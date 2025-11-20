# DeepSeek Chat Application

A full-stack web application that integrates with DeepSeek API to provide an intelligent chat interface. Built with Flask backend and vanilla HTML/CSS/JS frontend, ready for deployment on Vercel.

## Features

- 🤖 Integration with DeepSeek API for intelligent responses
- 💬 Clean, modern chat interface
- 📱 Fully responsive design
- ⚡ Fast and efficient API communication
- 🔒 Secure API key management
- 🚀 Production-ready and deployable to Vercel

## Project Structure

```
.
├── backend/
│   └── app.py          # Flask backend with DeepSeek API integration
├── frontend/
│   ├── index.html      # Main HTML page
│   ├── style.css       # Styling
│   └── script.js       # Frontend JavaScript
├── requirements.txt    # Python dependencies
├── vercel.json        # Vercel deployment configuration
├── .env.example       # Environment variables template
└── README.md          # This file
```

## Local Development Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- DeepSeek API key (get it from https://platform.deepseek.com/)

### Installation Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd cursorai
   ```

2. **Create a virtual environment (recommended)**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   DEEPSEEK_API_KEY=your_actual_api_key_here
   ```

5. **Run the Flask application**
   ```bash
   python backend/app.py
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5000` to see the application.

## Deployment to Vercel

### Step 1: Install Vercel CLI (optional but recommended)
```bash
npm i -g vercel
```

### Step 2: Configure Environment Variables

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name**: `DEEPSEEK_API_KEY`
   - **Value**: Your DeepSeek API key

Alternatively, you can set it via CLI:
```bash
vercel env add DEEPSEEK_API_KEY
```

### Step 3: Deploy

**Option A: Using Vercel CLI**
```bash
vercel
```

**Option B: Using GitHub Integration**
1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect the configuration from `vercel.json`

### Step 4: Verify Deployment

After deployment, visit your Vercel URL and test the application. The API routes should work at `https://your-domain.vercel.app/api/ask`.

## API Endpoints

### `POST /api/ask`
Send a question to DeepSeek and get a response.

**Request Body:**
```json
{
  "question": "What is artificial intelligence?"
}
```

**Success Response:**
```json
{
  "answer": "Artificial intelligence (AI) is...",
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

### `GET /api/health`
Health check endpoint to verify the API is running.

**Response:**
```json
{
  "status": "healthy",
  "api_key_configured": true
}
```

## Configuration

### Environment Variables

- `DEEPSEEK_API_KEY`: Your DeepSeek API key (required)

### DeepSeek API Settings

The application uses the following default settings for DeepSeek API:
- Model: `deepseek-chat`
- Temperature: `0.7`
- Max Tokens: `2000`

You can modify these in `backend/app.py` if needed.

## Troubleshooting

### API Key Issues
- Ensure your `.env` file is in the root directory
- Check that `DEEPSEEK_API_KEY` is set correctly
- For Vercel, verify the environment variable is set in project settings

### CORS Errors
- The Flask app includes CORS support. If you encounter issues, check the `flask-cors` configuration in `backend/app.py`

### Deployment Issues
- Ensure `vercel.json` is in the root directory
- Check that all dependencies are listed in `requirements.txt`
- Verify environment variables are set in Vercel dashboard

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API Integration**: DeepSeek API
- **Deployment**: Vercel
- **Package Management**: pip, requirements.txt

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the DeepSeek API documentation: https://platform.deepseek.com/api-docs/
3. Check Vercel deployment documentation: https://vercel.com/docs