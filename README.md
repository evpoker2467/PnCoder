# PnCoder - AI Programming Assistant

PnCoder is a modern web application that connects to the Qwen3 Coder API to provide AI-powered programming assistance. Users can ask questions about programming, request code examples, get help with debugging, and build applications with the help of AI.

## Features

- 🤖 **AI-Powered Assistance**: Powered by Qwen3 Coder 480B A35B (free) model
- 💬 **Real-time Chat Interface**: Clean, modern chat UI with message history
- 🎨 **Beautiful Design**: Responsive design that works on all devices
- 💾 **Local Storage**: Chat history and settings are saved locally
- ⚙️ **Customizable Settings**: Configure API key, site URL, and site name
- 📱 **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- 🚀 **Fast & Lightweight**: No build process required, pure HTML/CSS/JS

## Live Demo

[View Live Demo](https://your-netlify-url.netlify.app) *(Replace with your actual Netlify URL)*

## Quick Start

### Option 1: Use the Live Demo
1. Visit the live demo URL
2. The API key is pre-configured via environment variables
3. Start chatting with the AI immediately!

### Option 2: Deploy Your Own

#### Prerequisites
- An OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))
- A Netlify account (free)
- A GitHub account
- A Netlify account

#### Deployment Steps

1. **Fork this repository**
   ```bash
   git clone https://github.com/your-username/PnCoder.git
   cd PnCoder
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Netlify will automatically deploy the site
   - The build process will inject environment variables

3. **Configure Environment Variables**
   - Go to your Netlify dashboard
   - Navigate to Site settings > Environment variables
   - Add the following variables:
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `SITE_URL`: Your site URL (optional)
     - `SITE_NAME`: Your site name (optional)

4. **Redeploy your site**
   - Trigger a new deployment to apply the environment variables
   - Your site will now use the configured API key automatically

## API Configuration

### Getting an OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to the API keys section
4. Create a new API key
5. Add it as an environment variable in Netlify

### Environment Variables

PnCoder uses the following environment variables:
- **OPENROUTER_API_KEY** (required): Your OpenRouter API key
- **SITE_URL** (optional): Your site URL for API tracking
- **SITE_NAME** (optional): Your site name for API tracking

### API Usage

PnCoder uses the following API configuration:
- **Model**: `qwen/qwen3-coder:free`
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Max Tokens**: 4000
- **Temperature**: 0.7

## Usage

### Basic Usage
1. Open the application
2. The API key is automatically configured via environment variables
3. Start asking programming questions immediately!
4. Click the Settings button (⚙️) to view configuration status

### Example Prompts
- "Create a React component for a todo list"
- "Explain how async/await works in JavaScript"
- "Help me debug this Python function"
- "Build a REST API with Node.js and Express"
- "What's the difference between let and const in JavaScript?"

### Features
- **Message History**: Your conversations are saved locally
- **Code Formatting**: Code blocks are automatically formatted
- **Responsive Design**: Works on all screen sizes
- **Keyboard Shortcuts**: Press Enter to send, Shift+Enter for new line
- **Character Counter**: Track your message length
- **Loading States**: Visual feedback during API calls

## File Structure

```
PnCoder/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── netlify.toml        # Netlify configuration
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Customization

### Styling
Edit `styles.css` to customize the appearance:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Responsive breakpoints

### Functionality
Edit `script.js` to modify behavior:
- API configuration
- Message formatting
- UI interactions
- Storage settings

### Content
Edit `index.html` to change:
- Welcome messages
- Example prompts
- Meta information
- Page structure

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Privacy & Security

- **Local Storage Only**: All data is stored locally in your browser
- **No Server**: No data is sent to any server except the OpenRouter API
- **API Key Security**: Your API key is stored locally and never shared
- **HTTPS Only**: Secure connections for all API calls

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues:

1. Check that your API key is valid
2. Ensure you have an active internet connection
3. Try refreshing the page
4. Clear your browser's local storage if needed

For additional support, please open an issue on GitHub.

## Changelog

### Version 1.0.0
- Initial release
- Basic chat interface
- OpenRouter API integration
- Local storage for messages and settings
- Responsive design
- Code formatting support

---

**Made with ❤️ for the programming community**
