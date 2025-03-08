# WebXR Tarot Reading Application

A virtual reality tarot reading application built with A-Frame that works on Meta Quest 3 with hand tracking.

## Features

- Immersive mystical environment with a tarot table
- Full Major Arcana deck with card meanings
- Two spread types: Three-Card and Celtic Cross
- Hand tracking for natural interaction with cards
- Card flip animations and sound effects
- Detailed card meaning display

## Requirements

- Meta Quest 3 (or other WebXR-compatible VR headset with hand tracking)
- Modern web browser with WebXR support
- Internet connection (for loading assets)

## How to Use

1. **Setup**:
   - Host the application on a web server or use a local development server
   - Access the application URL on your Meta Quest 3 browser
   - Grant necessary permissions for hand tracking

2. **Controls**:
   - Use your hands to interact with the UI and cards
   - Pinch gesture (thumb and index finger) to select buttons
   - Grab gesture (closed hand) to pick up and move cards
   - Tap/click on a card to flip it and reveal its meaning

3. **Reading Process**:
   - Click the "Shuffle Deck" button to shuffle the cards
   - Select either "3-Card Spread" or "Celtic Cross" button
   - Cards will be automatically dealt to their positions
   - Flip each card to reveal its meaning
   - The card's meaning will be displayed above the table
   - Use the "Reset" button to clear the spread and start over

## Spread Types

### Three-Card Spread
A simple spread with three positions:
- Past: Influences from the past affecting the situation
- Present: Current situation and immediate influences
- Future: Potential outcome or future influences

### Celtic Cross Spread
A more complex 10-card spread:
1. Present: The present situation or influence
2. Challenge: An immediate challenge or obstacle
3. Foundation: The basis of the situation
4. Recent Past: Events that are just passing
5. Potential: The best outcome that could be achieved
6. Near Future: Events coming in the near future
7. Self: Your attitude or approach to the situation
8. Environment: The influence of others
9. Hopes/Fears: Your hopes and/or fears about the outcome
10. Outcome: The ultimate outcome of the situation

## Development

### File Structure
- `index.html` - Main HTML file with A-Frame scene setup
- `js/card-system.js` - Tarot deck and card components
- `js/hand-tracking.js` - Hand tracking and gesture detection
- `js/spreads.js` - Tarot spread layouts and positioning
- `assets/` - Directory for images and sounds

### Adding Card Images
Before using the application, you'll need to add card images to the `assets/images/major-arcana/` directory. Each card should be named according to its ID in the card data (e.g., `fool.jpg`, `magician.jpg`, etc.).

You'll also need to add a card back image at `assets/images/card-back.jpg`.

### Adding Sound Effects
The application uses the following sound files:
- `assets/sounds/card-flip.mp3` - Sound when flipping a card
- `assets/sounds/card-shuffle.mp3` - Sound when shuffling the deck
- `assets/sounds/ambient-music.mp3` - Background ambient music

## Customization

### Changing the Visual Style
The application uses a dark purple/blue color scheme. You can modify the colors in the HTML file:
- Main purple color: `#9370DB`
- Dark background: `#1a1a2e`
- Secondary background: `#2a2a4e`
- Table color: `#4B0082`

### Adding More Cards
To add the Minor Arcana or other cards, modify the `TAROT_CARDS` array in `js/card-system.js` and add the corresponding images to the assets directory.

## Troubleshooting

- **Hand tracking not working**: Ensure you have good lighting and that your hands are visible to the headset cameras.
- **Performance issues**: Reduce the complexity of the environment or disable some visual effects.
- **Cards not appearing**: Check that all card images are properly loaded in the assets directory.

## Credits

- Built with [A-Frame](https://aframe.io/)
- Uses [Super Hands](https://github.com/wmurphyrd/aframe-super-hands-component) for interactions
- Tarot card meanings sourced from traditional tarot interpretations

## License

This project is available for personal and educational use.

---

Enjoy your virtual tarot reading experience! 