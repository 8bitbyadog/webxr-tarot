/**
 * spreads.js
 * 
 * This file contains the tarot spread component that manages different card layouts:
 * - Three-card spread (Past, Present, Future)
 * - Celtic Cross spread (10 cards)
 * 
 * The component handles:
 * - Setting up position markers for each spread
 * - Placing cards in their designated positions
 * - Assigning meaning to each position
 * - Animating the dealing of cards
 */

// Wait for A-Frame to be ready before registering components
window.addEventListener('DOMContentLoaded', function() {
    // Check if AFRAME exists
    if (typeof AFRAME === 'undefined') {
        console.error('A-Frame not loaded in spreads.js');
        return;
    }

    /**
     * Tarot spread component for managing different card layouts
     */
    AFRAME.registerComponent('tarot-spread', {
        schema: {
            type: {type: 'string', default: 'none'}, // Type of spread: 'none', 'three-card', 'celtic-cross'
            dealSpeed: {type: 'number', default: 500}, // Speed of dealing animation in ms
            dealDelay: {type: 'number', default: 300}, // Delay between dealing cards in ms
            showPositionMarkers: {type: 'boolean', default: true} // Whether to show position markers
        },
        
        init: function() {
            // Initialize arrays to track position markers and cards
            this.positionMarkers = [];
            this.placedCards = [];
            
            // Define spread layouts
            this.defineSpreadLayouts();
        },
        
        defineSpreadLayouts: function() {
            // Three-card spread (Past, Present, Future)
            this.threeCardSpread = [
                {
                    position: {x: -0.15, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Past',
                    description: 'Influences from the past that affect the situation'
                },
                {
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Present',
                    description: 'Current situation and immediate influences'
                },
                {
                    position: {x: 0.15, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Future',
                    description: 'Potential outcome or future influences'
                }
            ];
            
            // Celtic Cross spread (10 cards)
            this.celticCrossSpread = [
                {
                    position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Present',
                    description: 'The present situation or influence'
                },
                {
                    position: {x: 0, y: 0, z: 0.005},
                    rotation: {x: 0, y: 0, z: 90},
                    name: 'Challenge',
                    description: 'An immediate challenge or obstacle'
                },
                {
                    position: {x: 0, y: 0, z: -0.15},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Foundation',
                    description: 'The basis of the situation, what has already happened'
                },
                {
                    position: {x: 0, y: 0, z: 0.15},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Recent Past',
                    description: 'Events that are just passing or have recently ended'
                },
                {
                    position: {x: 0.15, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Potential',
                    description: 'The best outcome that could be achieved'
                },
                {
                    position: {x: -0.15, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Near Future',
                    description: 'Events or influences coming in the near future'
                },
                {
                    position: {x: 0.25, y: 0, z: -0.2},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Self',
                    description: 'Your attitude or approach to the situation'
                },
                {
                    position: {x: 0.25, y: 0, z: -0.1},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Environment',
                    description: 'The influence of others or the environment'
                },
                {
                    position: {x: 0.25, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Hopes/Fears',
                    description: 'Your hopes and/or fears about the outcome'
                },
                {
                    position: {x: 0.25, y: 0, z: 0.1},
                    rotation: {x: 0, y: 0, z: 0},
                    name: 'Outcome',
                    description: 'The ultimate outcome of the situation'
                }
            ];
        },
        
        setupSpread: function(spreadType) {
            // Set the current spread type
            this.data.type = spreadType;
            
            // Clear any existing spread
            this.clearSpread();
            
            // Create position markers for the selected spread
            if (spreadType === 'three-card') {
                this.createPositionMarkers(this.threeCardSpread);
            } else if (spreadType === 'celtic-cross') {
                this.createPositionMarkers(this.celticCrossSpread);
            }
        },
        
        createPositionMarkers: function(spreadPositions) {
            // Create visual markers for each position in the spread
            spreadPositions.forEach((posData, index) => {
                if (this.data.showPositionMarkers) {
                    // Create marker entity
                    const marker = document.createElement('a-entity');
                    marker.setAttribute('mixin', 'position-marker');
                    marker.setAttribute('position', posData.position);
                    marker.setAttribute('rotation', posData.rotation);
                    marker.setAttribute('visible', true);
                    
                    // Add text label for position
                    const label = document.createElement('a-entity');
                    label.setAttribute('text', {
                        value: posData.name,
                        align: 'center',
                        width: 0.3,
                        color: '#9370DB',
                        opacity: 0.8
                    });
                    label.setAttribute('position', '0 -0.07 0');
                    label.setAttribute('rotation', '-90 0 0');
                    label.setAttribute('scale', '0.5 0.5 0.5');
                    
                    // Add label to marker
                    marker.appendChild(label);
                    
                    // Add marker to scene and track it
                    this.el.appendChild(marker);
                    this.positionMarkers.push(marker);
                }
            });
        },
        
        placeCards: function(cards) {
            // Get the appropriate spread layout
            let spreadPositions;
            if (this.data.type === 'three-card') {
                spreadPositions = this.threeCardSpread;
            } else if (this.data.type === 'celtic-cross') {
                spreadPositions = this.celticCrossSpread;
            } else {
                console.warn('Unknown spread type:', this.data.type);
                return;
            }
            
            // Make sure we have enough cards
            if (cards.length < spreadPositions.length) {
                console.warn('Not enough cards for the spread:', cards.length, 'provided,', spreadPositions.length, 'needed');
                return;
            }
            
            // Place each card with animation
            cards.forEach((card, index) => {
                if (index >= spreadPositions.length) return;
                
                // Get position data for this card
                const posData = spreadPositions[index];
                
                // Set position name in card component
                card.components['tarot-card'].setPosition(posData.name);
                
                // Calculate start position (from deck)
                const deckPosition = document.querySelector('#deck-position').getAttribute('position');
                
                // Set initial position at deck
                card.setAttribute('position', deckPosition);
                
                // Calculate target position (relative to spread container)
                const targetPos = {
                    x: this.el.object3D.position.x + posData.position.x,
                    y: this.el.object3D.position.y + posData.position.y,
                    z: this.el.object3D.position.z + posData.position.z
                };
                
                // Animate card to its position with delay based on index
                setTimeout(() => {
                    // Play dealing sound
                    const flipSound = document.querySelector('#card-flip');
                    if (flipSound) {
                        flipSound.currentTime = 0;
                        flipSound.volume = 0.3;
                        flipSound.play().catch(e => console.warn('Could not play audio:', e));
                    }
                    
                    // Animate position
                    card.setAttribute('animation__deal', {
                        property: 'position',
                        to: `${targetPos.x} ${targetPos.y} ${targetPos.z}`,
                        dur: this.data.dealSpeed,
                        easing: 'easeOutQuad'
                    });
                    
                    // Animate rotation
                    card.setAttribute('animation__rotate', {
                        property: 'rotation',
                        to: `${posData.rotation.x} ${posData.rotation.y} ${posData.rotation.z}`,
                        dur: this.data.dealSpeed,
                        easing: 'easeOutQuad'
                    });
                    
                    // Hide position marker when card arrives
                    setTimeout(() => {
                        if (this.positionMarkers[index]) {
                            this.positionMarkers[index].setAttribute('visible', false);
                        }
                    }, this.data.dealSpeed);
                    
                }, index * this.data.dealDelay);
                
                // Track placed cards
                this.placedCards.push(card);
            });
        },
        
        clearSpread: function() {
            // Remove position markers
            this.positionMarkers.forEach(marker => {
                if (marker.parentNode) {
                    marker.parentNode.removeChild(marker);
                }
            });
            this.positionMarkers = [];
            
            // Reset placed cards array (cards themselves are handled by the deck component)
            this.placedCards = [];
        },
        
        getSpreadPositions: function(spreadType) {
            // Return the positions for a given spread type
            if (spreadType === 'three-card') {
                return this.threeCardSpread;
            } else if (spreadType === 'celtic-cross') {
                return this.celticCrossSpread;
            }
            return [];
        },
        
        getPositionMeaning: function(positionName) {
            // Find position data by name
            let allPositions = [...this.threeCardSpread, ...this.celticCrossSpread];
            let posData = allPositions.find(pos => pos.name === positionName);
            
            if (posData) {
                return posData.description;
            }
            return '';
        }
    });

    console.log('Tarot spread component registered successfully');
});

// Fallback to ensure components are registered even if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        if (!AFRAME.components['tarot-spread']) {
            console.log('Registering spread component after page load');
            // Trigger the event handler manually
            window.dispatchEvent(new Event('DOMContentLoaded'));
        }
    }, 1000);
} 