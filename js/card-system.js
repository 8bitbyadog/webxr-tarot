/**
 * card-system.js
 * 
 * This file contains the core components for the tarot card system:
 * - tarot-manager: Overall manager for the tarot application
 * - tarot-deck: Manages the deck of cards, shuffling, and dealing
 * - tarot-card: Individual card behavior including flipping and revealing meanings
 */

// Tarot card data - Major Arcana with meanings
const TAROT_CARDS = [
    {
        id: 'fool',
        name: 'The Fool',
        number: 0,
        upright: 'New beginnings, innocence, spontaneity, free spirit',
        reversed: 'Recklessness, risk-taking, inconsideration'
    },
    {
        id: 'magician',
        name: 'The Magician',
        number: 1,
        upright: 'Manifestation, resourcefulness, power, inspired action',
        reversed: 'Manipulation, poor planning, untapped talents'
    },
    {
        id: 'high-priestess',
        name: 'The High Priestess',
        number: 2,
        upright: 'Intuition, sacred knowledge, divine feminine, subconscious mind',
        reversed: 'Secrets, disconnected from intuition, withdrawal'
    },
    {
        id: 'empress',
        name: 'The Empress',
        number: 3,
        upright: 'Femininity, beauty, nature, nurturing, abundance',
        reversed: 'Creative block, dependence on others, emptiness'
    },
    {
        id: 'emperor',
        name: 'The Emperor',
        number: 4,
        upright: 'Authority, structure, control, fatherhood, stability',
        reversed: 'Domination, excessive control, rigidity, stubbornness'
    },
    {
        id: 'hierophant',
        name: 'The Hierophant',
        number: 5,
        upright: 'Spiritual wisdom, religious beliefs, conformity, tradition',
        reversed: 'Personal beliefs, freedom, challenging the status quo'
    },
    {
        id: 'lovers',
        name: 'The Lovers',
        number: 6,
        upright: 'Love, harmony, relationships, values alignment, choices',
        reversed: 'Self-love, disharmony, imbalance, misalignment of values'
    },
    {
        id: 'chariot',
        name: 'The Chariot',
        number: 7,
        upright: 'Control, willpower, success, action, determination',
        reversed: 'Self-discipline, opposition, lack of direction'
    },
    {
        id: 'strength',
        name: 'Strength',
        number: 8,
        upright: 'Strength, courage, persuasion, influence, compassion',
        reversed: 'Inner strength, self-doubt, low energy, raw emotion'
    },
    {
        id: 'hermit',
        name: 'The Hermit',
        number: 9,
        upright: 'Soul-searching, introspection, being alone, inner guidance',
        reversed: 'Isolation, loneliness, withdrawal'
    },
    {
        id: 'wheel-of-fortune',
        name: 'Wheel of Fortune',
        number: 10,
        upright: 'Good luck, karma, life cycles, destiny, a turning point',
        reversed: 'Bad luck, resistance to change, breaking cycles'
    },
    {
        id: 'justice',
        name: 'Justice',
        number: 11,
        upright: 'Justice, fairness, truth, cause and effect, law',
        reversed: 'Unfairness, lack of accountability, dishonesty'
    },
    {
        id: 'hanged-man',
        name: 'The Hanged Man',
        number: 12,
        upright: 'Surrender, letting go, new perspectives, enlightenment',
        reversed: 'Resistance, stalling, indecision, delays'
    },
    {
        id: 'death',
        name: 'Death',
        number: 13,
        upright: 'Endings, change, transformation, transition',
        reversed: 'Resistance to change, inability to move on, stagnation'
    },
    {
        id: 'temperance',
        name: 'Temperance',
        number: 14,
        upright: 'Balance, moderation, patience, purpose',
        reversed: 'Imbalance, excess, self-healing, realignment'
    },
    {
        id: 'devil',
        name: 'The Devil',
        number: 15,
        upright: 'Shadow self, attachment, addiction, restriction, sexuality',
        reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment'
    },
    {
        id: 'tower',
        name: 'The Tower',
        number: 16,
        upright: 'Sudden change, upheaval, chaos, revelation, awakening',
        reversed: 'Personal transformation, fear of change, averting disaster'
    },
    {
        id: 'star',
        name: 'The Star',
        number: 17,
        upright: 'Hope, faith, purpose, renewal, spirituality',
        reversed: 'Lack of faith, despair, self-trust, disconnection'
    },
    {
        id: 'moon',
        name: 'The Moon',
        number: 18,
        upright: 'Illusion, fear, anxiety, subconscious, intuition',
        reversed: 'Release of fear, repressed emotion, inner confusion'
    },
    {
        id: 'sun',
        name: 'The Sun',
        number: 19,
        upright: 'Positivity, fun, warmth, success, vitality',
        reversed: 'Inner child, feeling down, overly optimistic'
    },
    {
        id: 'judgement',
        name: 'Judgement',
        number: 20,
        upright: 'Judgement, rebirth, inner calling, absolution',
        reversed: 'Self-doubt, inner critic, ignoring the call'
    },
    {
        id: 'world',
        name: 'The World',
        number: 21,
        upright: 'Completion, integration, accomplishment, travel',
        reversed: 'Seeking personal closure, short-cuts, delays'
    }
];

// Wait for A-Frame to be ready before registering components
window.addEventListener('DOMContentLoaded', function() {
    // Check if AFRAME exists
    if (typeof AFRAME === 'undefined') {
        console.error('A-Frame not loaded');
        // Display visible error
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '20px';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = 'Error: A-Frame not loaded. Please refresh the page.';
        document.body.appendChild(errorDiv);
        return;
    }

    /**
     * Main tarot manager component that coordinates the overall application
     */
    AFRAME.registerComponent('tarot-manager', {
        schema: {
            activeSpread: {type: 'string', default: 'none'}, // Current active spread
            isShuffling: {type: 'boolean', default: false},  // Whether deck is currently shuffling
            isDealing: {type: 'boolean', default: false},    // Whether cards are being dealt
            isRevealing: {type: 'boolean', default: false}   // Whether cards are being revealed
        },
        
        init: function() {
            // Get references to key elements
            this.deckEl = document.querySelector('#deck-position');
            this.spreadEl = document.querySelector('#spread-positions');
            this.meaningEl = document.querySelector('#card-meaning');
            
            // Set up event listeners for UI buttons
            this.setupEventListeners();
            
            // Play ambient music
            const ambientMusic = document.querySelector('#ambient-music');
            if (ambientMusic) {
                ambientMusic.volume = 0.3;
                ambientMusic.loop = true;
                
                // Only play music after user interaction due to browser autoplay policies
                document.addEventListener('click', () => {
                    ambientMusic.play().catch(e => console.warn('Could not play audio:', e));
                }, {once: true});
            }
            
            // Initialize the application state
            this.resetApplication();
        },
        
        setupEventListeners: function() {
            // Shuffle button
            const shuffleBtn = document.querySelector('#shuffle-button');
            shuffleBtn.addEventListener('click', () => {
                if (!this.data.isShuffling && !this.data.isDealing) {
                    this.shuffleDeck();
                }
            });
            
            // Three-card spread button
            const threeCardBtn = document.querySelector('#three-card-button');
            threeCardBtn.addEventListener('click', () => {
                if (!this.data.isShuffling && !this.data.isDealing) {
                    this.setActiveSpread('three-card');
                }
            });
            
            // Celtic Cross spread button
            const celticCrossBtn = document.querySelector('#celtic-cross-button');
            celticCrossBtn.addEventListener('click', () => {
                if (!this.data.isShuffling && !this.data.isDealing) {
                    this.setActiveSpread('celtic-cross');
                }
            });
            
            // Reset button
            const resetBtn = document.querySelector('#reset-button');
            resetBtn.addEventListener('click', () => {
                this.resetApplication();
            });
            
            // Listen for card flip events to update meaning display
            this.el.addEventListener('cardFlipped', (event) => {
                const cardData = event.detail;
                this.displayCardMeaning(cardData);
            });
        },
        
        shuffleDeck: function() {
            this.data.isShuffling = true;
            
            // Trigger shuffle in the deck component
            this.deckEl.components['tarot-deck'].shuffle();
            
            // Play shuffle sound
            const shuffleSound = document.querySelector('#card-shuffle');
            if (shuffleSound) {
                shuffleSound.currentTime = 0;
                shuffleSound.play().catch(e => console.warn('Could not play audio:', e));
            }
            
            // Update UI
            this.meaningEl.setAttribute('text', 'value', 'Shuffling the deck...');
            
            // Reset shuffling state after animation completes
            setTimeout(() => {
                this.data.isShuffling = false;
                this.meaningEl.setAttribute('text', 'value', 'Deck shuffled. Select a spread or shuffle again.');
            }, 2000);
        },
        
        setActiveSpread: function(spreadType) {
            this.data.activeSpread = spreadType;
            
            // Clear any existing spread
            this.spreadEl.components['tarot-spread'].clearSpread();
            
            // Set up the new spread
            this.spreadEl.components['tarot-spread'].setupSpread(spreadType);
            
            // Deal cards to the spread
            this.dealCards(spreadType);
            
            // Update UI
            this.meaningEl.setAttribute('text', 'value', `Dealing ${spreadType} spread...`);
        },
        
        dealCards: function(spreadType) {
            this.data.isDealing = true;
            
            // Get cards from the deck
            const numCards = (spreadType === 'three-card') ? 3 : 10;
            const cards = this.deckEl.components['tarot-deck'].dealCards(numCards);
            
            // Pass cards to the spread component for positioning
            this.spreadEl.components['tarot-spread'].placeCards(cards);
            
            // Reset dealing state after animation completes
            const dealDuration = (spreadType === 'three-card') ? 3000 : 8000;
            setTimeout(() => {
                this.data.isDealing = false;
                this.meaningEl.setAttribute('text', 'value', 'Cards dealt. Flip cards to reveal their meanings.');
            }, dealDuration);
        },
        
        displayCardMeaning: function(cardData) {
            // Format and display the card meaning
            const position = cardData.position || '';
            const positionText = position ? `Position: ${position}\n` : '';
            
            const meaningText = cardData.isReversed ? cardData.reversed : cardData.upright;
            
            const displayText = `${cardData.name} ${cardData.isReversed ? '(Reversed)' : ''}\n` +
                               `${positionText}` +
                               `Meaning: ${meaningText}`;
            
            this.meaningEl.setAttribute('text', 'value', displayText);
        },
        
        resetApplication: function() {
            // Reset state
            this.data.activeSpread = 'none';
            this.data.isShuffling = false;
            this.data.isDealing = false;
            this.data.isRevealing = false;
            
            // Clear the spread
            if (this.spreadEl.components['tarot-spread']) {
                this.spreadEl.components['tarot-spread'].clearSpread();
            }
            
            // Reset the deck
            if (this.deckEl.components['tarot-deck']) {
                this.deckEl.components['tarot-deck'].resetDeck();
            }
            
            // Reset UI
            this.meaningEl.setAttribute('text', 'value', 'Select a spread and draw cards');
        }
    });

    /**
     * Tarot deck component that manages the collection of cards
     */
    AFRAME.registerComponent('tarot-deck', {
        schema: {
            cardWidth: {type: 'number', default: 0.063},
            cardHeight: {type: 'number', default: 0.11},
            cardDepth: {type: 'number', default: 0.001},
            cardGap: {type: 'number', default: 0.0005},
            maxStackHeight: {type: 'number', default: 0.05}
        },
        
        init: function() {
            // Initialize the deck
            this.cards = [];
            this.dealtCards = [];
            
            // Create the deck of cards
            this.createDeck();
            
            // Shuffle the deck initially
            this.shuffle();
        },
        
        createDeck: function() {
            // Clear any existing cards
            this.removeExistingCards();
            this.cards = [];
            this.dealtCards = [];
            
            // Create card entities for each card in the data
            TAROT_CARDS.forEach((cardData, index) => {
                // Create card entity
                const cardEntity = document.createElement('a-entity');
                cardEntity.setAttribute('id', `card-${cardData.id}`);
                cardEntity.setAttribute('mixin', 'card');
                cardEntity.setAttribute('tarot-card', {
                    cardId: cardData.id,
                    cardName: cardData.name,
                    cardNumber: cardData.number,
                    upright: cardData.upright,
                    reversed: cardData.reversed
                });
                
                // Set initial position in the deck
                const yOffset = index * (this.data.cardDepth + this.data.cardGap);
                cardEntity.setAttribute('position', `0 ${yOffset} 0`);
                
                // Set initial rotation (face down)
                cardEntity.setAttribute('rotation', '0 0 0');
                
                // Add physics for interactions
                cardEntity.setAttribute('dynamic-body', 'mass: 0.1; linearDamping: 0.9; angularDamping: 0.9;');
                
                // Add to the scene and track in our array
                this.el.appendChild(cardEntity);
                this.cards.push(cardEntity);
            });
        },
        
        removeExistingCards: function() {
            // Remove all existing card entities
            const existingCards = this.el.querySelectorAll('[tarot-card]');
            existingCards.forEach(card => {
                card.parentNode.removeChild(card);
            });
        },
        
        shuffle: function() {
            // Return any dealt cards to the deck
            this.returnDealtCards();
            
            // Shuffle the array of cards
            for (let i = this.cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
                
                // Randomly determine if card should be reversed
                const isReversed = Math.random() > 0.5;
                this.cards[i].components['tarot-card'].data.isReversed = isReversed;
            }
            
            // Animate the shuffle
            this.animateShuffle();
        },
        
        animateShuffle: function() {
            // Animate cards during shuffle
            this.cards.forEach((card, index) => {
                // Calculate final position in stack
                const yOffset = index * (this.data.cardDepth + this.data.cardGap);
                
                // Animate to random position and back to stack
                const randomX = (Math.random() - 0.5) * 0.1;
                const randomZ = (Math.random() - 0.5) * 0.1;
                const randomRotY = Math.random() * 360;
                
                // First animation: Move out randomly
                card.setAttribute('animation__shuffle1', {
                    property: 'position',
                    to: `${randomX} ${yOffset + 0.05} ${randomZ}`,
                    dur: 500,
                    easing: 'easeOutQuad'
                });
                
                card.setAttribute('animation__rotate1', {
                    property: 'rotation',
                    to: `0 ${randomRotY} 0`,
                    dur: 500,
                    easing: 'easeOutQuad'
                });
                
                // Second animation: Move back to stack
                setTimeout(() => {
                    card.setAttribute('animation__shuffle2', {
                        property: 'position',
                        to: `0 ${yOffset} 0`,
                        dur: 500,
                        easing: 'easeInQuad'
                    });
                    
                    card.setAttribute('animation__rotate2', {
                        property: 'rotation',
                        to: '0 0 0',
                        dur: 500,
                        easing: 'easeInQuad'
                    });
                }, 500);
            });
        },
        
        dealCards: function(numCards) {
            // Get the requested number of cards from the top of the deck
            const dealtCards = this.cards.splice(0, numCards);
            this.dealtCards = this.dealtCards.concat(dealtCards);
            return dealtCards;
        },
        
        returnDealtCards: function() {
            // Return all dealt cards to the deck
            this.cards = this.cards.concat(this.dealtCards);
            this.dealtCards = [];
            
            // Reset card positions
            this.cards.forEach((card, index) => {
                const yOffset = index * (this.data.cardDepth + this.data.cardGap);
                card.setAttribute('position', `0 ${yOffset} 0`);
                card.setAttribute('rotation', '0 0 0');
                
                // Reset card state
                card.components['tarot-card'].resetCard();
            });
        },
        
        resetDeck: function() {
            // Completely reset the deck
            this.createDeck();
            this.shuffle();
        }
    });

    /**
     * Tarot card component for individual card behavior
     */
    AFRAME.registerComponent('tarot-card', {
        schema: {
            cardId: {type: 'string', default: ''},
            cardName: {type: 'string', default: ''},
            cardNumber: {type: 'number', default: 0},
            upright: {type: 'string', default: ''},
            reversed: {type: 'string', default: ''},
            isReversed: {type: 'boolean', default: false},
            isFlipped: {type: 'boolean', default: false},
            position: {type: 'string', default: ''} // Position in the spread (e.g., "Past", "Present")
        },
        
        init: function() {
            // Set up the card visuals
            this.setupCardVisuals();
            
            // Set up interaction handlers
            this.setupInteractions();
            
            // Initialize card state
            this.resetCard();
        },
        
        setupCardVisuals: function() {
            // Set the card back texture
            this.el.setAttribute('material', 'src', '#card-back');
            
            // Create front face entity (initially hidden)
            this.frontFace = document.createElement('a-entity');
            this.frontFace.setAttribute('geometry', `primitive: plane; width: ${this.el.getAttribute('geometry').width}; height: ${this.el.getAttribute('geometry').height}`);
            this.frontFace.setAttribute('material', `shader: flat; side: double; transparent: true; src: #${this.data.cardId}`);
            this.frontFace.setAttribute('position', '0 0 0.001'); // Slightly in front to avoid z-fighting
            this.frontFace.setAttribute('visible', 'false');
            
            // Add front face to card
            this.el.appendChild(this.frontFace);
        },
        
        setupInteractions: function() {
            // Double-click to flip card
            this.el.addEventListener('click', this.onCardClick.bind(this));
            
            // Handle grab start
            this.el.addEventListener('grabstart', () => {
                // Disable physics constraints temporarily while grabbed
                this.el.setAttribute('dynamic-body', 'enabled', false);
            });
            
            // Handle grab end
            this.el.addEventListener('grabend', () => {
                // Re-enable physics
                this.el.setAttribute('dynamic-body', 'enabled', true);
            });
        },
        
        onCardClick: function(evt) {
            // Prevent event bubbling
            evt.stopPropagation();
            evt.preventDefault();
            
            // Only allow flipping if card is in a spread
            if (this.data.position) {
                this.flipCard();
            }
        },
        
        flipCard: function() {
            if (this.data.isFlipped) return;
            
            // Play flip sound
            const flipSound = document.querySelector('#card-flip');
            if (flipSound) {
                flipSound.currentTime = 0;
                flipSound.play().catch(e => console.warn('Could not play audio:', e));
            }
            
            // Animate card flip
            const currentRotation = this.el.getAttribute('rotation');
            const targetY = currentRotation.y + 180;
            
            this.el.setAttribute('animation__flip', {
                property: 'rotation',
                to: `${currentRotation.x} ${targetY} ${currentRotation.z}`,
                dur: 1000,
                easing: 'easeOutQuad'
            });
            
            // Show front face halfway through animation
            setTimeout(() => {
                this.el.setAttribute('material', 'opacity', 0);
                this.frontFace.setAttribute('visible', true);
                
                // Apply rotation for reversed cards
                if (this.data.isReversed) {
                    this.frontFace.setAttribute('rotation', '0 0 180');
                }
            }, 500);
            
            // Update state
            this.data.isFlipped = true;
            
            // Emit event with card data for meaning display
            this.el.sceneEl.emit('cardFlipped', {
                id: this.data.cardId,
                name: this.data.cardName,
                number: this.data.cardNumber,
                upright: this.data.upright,
                reversed: this.data.reversed,
                isReversed: this.data.isReversed,
                position: this.data.position
            });
        },
        
        setPosition: function(positionName) {
            this.data.position = positionName;
        },
        
        resetCard: function() {
            // Reset card state
            this.data.isFlipped = false;
            
            // Reset visuals
            this.el.setAttribute('material', {src: '#card-back', opacity: 1});
            if (this.frontFace) {
                this.frontFace.setAttribute('visible', false);
                this.frontFace.setAttribute('rotation', '0 0 0');
            }
        }
    });

    console.log('Tarot card system components registered successfully');
});

// Fallback to ensure components are registered even if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        if (!AFRAME.components['tarot-manager']) {
            console.log('Registering components after page load');
            // Trigger the event handler manually
            window.dispatchEvent(new Event('DOMContentLoaded'));
        }
    }, 1000);
} 