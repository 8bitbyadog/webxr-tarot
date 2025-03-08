# WebXR Tarot

An immersive WebXR tarot reading experience that works on VR devices like the Meta Quest, featuring hand tracking for natural interaction with the cards.

## Features

- Full Major Arcana deck with beautiful card artwork
- Hand tracking for natural card interaction
- Multiple spread options (3-card spread and Celtic Cross)
- Immersive 3D environment
- Ambient sound effects and music
- Responsive design that works in both VR and non-VR modes

## Requirements

- A WebXR-compatible browser
- For VR: A compatible VR headset (tested with Meta Quest)
- For hand tracking: A device with hand tracking capabilities (like Meta Quest)

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd webxr-tarot
```

2. Serve the files using a local web server. You can use Python's built-in server:
```bash
python -m http.server 8000
```

3. Access the application:
- Local development: Visit `http://localhost:8000`
- VR headset: Visit `http://[your-local-ip]:8000`

## Usage

1. Put on your VR headset and visit the application URL
2. Enable hand tracking on your device
3. Use the UI buttons to:
   - Shuffle the deck
   - Choose a spread type (3-card or Celtic Cross)
   - Reset the reading
4. Use your hands to:
   - Draw cards from the deck
   - Place cards in the spread positions
   - Flip cards to reveal their meanings

## Development

The application uses:
- A-Frame for WebXR/3D rendering
- Custom hand tracking components
- Modular JavaScript for card and spread management

## License

[Your chosen license]

## Credits

- Card artwork: [Credit your source]
- Sound effects: [Credit your source]
- Ambient music: [Credit your source] 