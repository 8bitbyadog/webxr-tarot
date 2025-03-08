/**
 * hand-tracking.js
 * 
 * This file contains components for enhancing hand tracking interactions in the WebXR tarot application:
 * - hand-tracking-extras: Adds visual feedback and enhanced gestures for hand tracking
 * - pinch-detector: Detects pinch gestures for precise card manipulation
 * - gesture-detector: Detects various hand gestures for application control
 */

// Wait for A-Frame to be ready before registering components
window.addEventListener('DOMContentLoaded', function() {
    // Check if AFRAME exists
    if (typeof AFRAME === 'undefined') {
        console.error('A-Frame not loaded in hand-tracking.js');
        return;
    }

    /**
     * Component to enhance hand tracking with visual feedback and additional gestures
     */
    AFRAME.registerComponent('hand-tracking-extras', {
        schema: {
            hand: {type: 'string', default: 'right'}, // 'right' or 'left'
            pinchThreshold: {type: 'number', default: 0.05}, // Distance threshold for pinch detection
            grabThreshold: {type: 'number', default: 0.1}, // Distance threshold for grab detection
            showPinchIndicator: {type: 'boolean', default: true}, // Whether to show visual feedback for pinch
            showGrabIndicator: {type: 'boolean', default: true}, // Whether to show visual feedback for grab
            indicatorColor: {type: 'color', default: '#9370DB'}, // Color for indicators
            indicatorSize: {type: 'number', default: 0.01} // Size of indicators
        },
        
        init: function() {
            // Store references to hand joints
            this.joints = {};
            
            // Track gesture states
            this.isPinching = false;
            this.isGrabbing = false;
            
            // Create visual indicators
            if (this.data.showPinchIndicator) {
                this.createPinchIndicator();
            }
            
            if (this.data.showGrabIndicator) {
                this.createGrabIndicator();
            }
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Bind methods to maintain context
            this.onHandFound = this.onHandFound.bind(this);
            this.onHandLost = this.onHandLost.bind(this);
            this.updateJoints = this.updateJoints.bind(this);
            this.checkGestures = this.checkGestures.bind(this);
            
            // Debug text entity for hand tracking status
            this.createDebugText();
        },
        
        createPinchIndicator: function() {
            // Create visual indicator for pinch gesture
            this.pinchIndicator = document.createElement('a-entity');
            this.pinchIndicator.setAttribute('geometry', {
                primitive: 'sphere',
                radius: this.data.indicatorSize
            });
            this.pinchIndicator.setAttribute('material', {
                color: this.data.indicatorColor,
                opacity: 0.7,
                transparent: true
            });
            this.pinchIndicator.setAttribute('visible', false);
            this.el.appendChild(this.pinchIndicator);
        },
        
        createGrabIndicator: function() {
            // Create visual indicator for grab gesture
            this.grabIndicator = document.createElement('a-entity');
            this.grabIndicator.setAttribute('geometry', {
                primitive: 'sphere',
                radius: this.data.indicatorSize * 1.5
            });
            this.grabIndicator.setAttribute('material', {
                color: this.data.indicatorColor,
                opacity: 0.5,
                transparent: true,
                wireframe: true
            });
            this.grabIndicator.setAttribute('visible', false);
            this.el.appendChild(this.grabIndicator);
        },
        
        createDebugText: function() {
            // Create debug text entity
            this.debugText = document.createElement('a-entity');
            this.debugText.setAttribute('text', {
                value: `${this.data.hand} hand tracking: waiting...`,
                align: 'center',
                width: 0.2,
                color: this.data.indicatorColor
            });
            this.debugText.setAttribute('position', '0 0.1 0');
            this.debugText.setAttribute('rotation', '0 0 0');
            this.debugText.setAttribute('visible', true);
            this.el.appendChild(this.debugText);
        },
        
        setupEventListeners: function() {
            // Listen for hand tracking events
            this.el.addEventListener('hand-tracking-extras-ready', this.onHandFound);
            this.el.addEventListener('hand-tracking-extras-lost', this.onHandLost);
        },
        
        onHandFound: function() {
            // Update debug text
            this.debugText.setAttribute('text', 'value', `${this.data.hand} hand tracking: active`);
            this.debugText.setAttribute('visible', true);
            
            // Start tracking
            this.isTracking = true;
        },
        
        onHandLost: function() {
            // Update debug text
            this.debugText.setAttribute('text', 'value', `${this.data.hand} hand tracking: lost`);
            
            // Reset gesture states
            this.isPinching = false;
            this.isGrabbing = false;
            
            // Hide indicators
            if (this.pinchIndicator) {
                this.pinchIndicator.setAttribute('visible', false);
            }
            
            if (this.grabIndicator) {
                this.grabIndicator.setAttribute('visible', false);
            }
            
            // Stop tracking
            this.isTracking = false;
        },
        
        tick: function() {
            // Skip if hand tracking is not active
            if (!this.el.components['hand-tracking-controls'] || 
                !this.el.components['hand-tracking-controls'].mesh) {
                return;
            }
            
            // Update joint positions
            this.updateJoints();
            
            // Check for gestures
            this.checkGestures();
        },
        
        updateJoints: function() {
            // Get hand mesh from hand-tracking-controls
            const handMesh = this.el.components['hand-tracking-controls'].mesh;
            if (!handMesh) return;
            
            // Get joint positions from the hand mesh
            const joints = handMesh.joints;
            if (!joints) return;
            
            // Store joint positions for gesture detection
            this.joints = joints;
            
            // Hide debug text after hand is found and stable
            setTimeout(() => {
                this.debugText.setAttribute('visible', false);
            }, 3000);
        },
        
        checkGestures: function() {
            // Skip if joints are not available
            if (!this.joints || !this.joints['index-finger-tip'] || !this.joints['thumb-tip']) return;
            
            // Check for pinch gesture (thumb tip to index finger tip)
            const thumbTip = this.joints['thumb-tip'].position;
            const indexTip = this.joints['index-finger-tip'].position;
            
            // Calculate distance between thumb and index finger tips
            const pinchDistance = this.calculateDistance(thumbTip, indexTip);
            
            // Detect pinch gesture
            const wasPinching = this.isPinching;
            this.isPinching = pinchDistance < this.data.pinchThreshold;
            
            // Handle pinch state changes
            if (this.isPinching !== wasPinching) {
                if (this.isPinching) {
                    this.onPinchStart();
                } else {
                    this.onPinchEnd();
                }
            }
            
            // Update pinch indicator position
            if (this.isPinching && this.pinchIndicator) {
                // Position indicator between thumb and index finger
                const midpoint = {
                    x: (thumbTip.x + indexTip.x) / 2,
                    y: (thumbTip.y + indexTip.y) / 2,
                    z: (thumbTip.z + indexTip.z) / 2
                };
                
                this.pinchIndicator.setAttribute('position', midpoint);
                this.pinchIndicator.setAttribute('visible', true);
            } else if (this.pinchIndicator) {
                this.pinchIndicator.setAttribute('visible', false);
            }
            
            // Check for grab gesture (all fingertips close to palm)
            const wasGrabbing = this.isGrabbing;
            this.isGrabbing = this.detectGrabGesture();
            
            // Handle grab state changes
            if (this.isGrabbing !== wasGrabbing) {
                if (this.isGrabbing) {
                    this.onGrabStart();
                } else {
                    this.onGrabEnd();
                }
            }
            
            // Update grab indicator
            if (this.isGrabbing && this.grabIndicator) {
                // Position indicator at palm
                const palm = this.joints['wrist'].position;
                this.grabIndicator.setAttribute('position', palm);
                this.grabIndicator.setAttribute('visible', true);
            } else if (this.grabIndicator) {
                this.grabIndicator.setAttribute('visible', false);
            }
        },
        
        calculateDistance: function(point1, point2) {
            // Calculate Euclidean distance between two 3D points
            const dx = point1.x - point2.x;
            const dy = point1.y - point2.y;
            const dz = point1.z - point2.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        },
        
        detectGrabGesture: function() {
            // Skip if joints are not available
            if (!this.joints || !this.joints['wrist']) return false;
            
            // Get palm position (use wrist as reference)
            const palm = this.joints['wrist'].position;
            
            // Check distance of each fingertip to palm
            const fingerTips = [
                'thumb-tip',
                'index-finger-tip',
                'middle-finger-tip',
                'ring-finger-tip',
                'pinky-finger-tip'
            ];
            
            // Count how many fingers are curled (close to palm)
            let curledFingers = 0;
            
            for (const tip of fingerTips) {
                if (!this.joints[tip]) continue;
                
                const distance = this.calculateDistance(palm, this.joints[tip].position);
                if (distance < this.data.grabThreshold) {
                    curledFingers++;
                }
            }
            
            // Consider it a grab if at least 4 fingers are curled
            return curledFingers >= 4;
        },
        
        onPinchStart: function() {
            // Emit pinch start event
            this.el.emit('pinchstart', {hand: this.data.hand}, false);
            
            // Trigger haptic feedback if available
            if (this.el.components['haptics']) {
                this.el.components['haptics'].pulse(0.3, 100);
            }
        },
        
        onPinchEnd: function() {
            // Emit pinch end event
            this.el.emit('pinchend', {hand: this.data.hand}, false);
            
            // Trigger haptic feedback if available
            if (this.el.components['haptics']) {
                this.el.components['haptics'].pulse(0.1, 50);
            }
        },
        
        onGrabStart: function() {
            // Emit grab start event
            this.el.emit('grabstart', {hand: this.data.hand}, true);
            
            // Trigger haptic feedback if available
            if (this.el.components['haptics']) {
                this.el.components['haptics'].pulse(0.5, 100);
            }
        },
        
        onGrabEnd: function() {
            // Emit grab end event
            this.el.emit('grabend', {hand: this.data.hand}, true);
            
            // Trigger haptic feedback if available
            if (this.el.components['haptics']) {
                this.el.components['haptics'].pulse(0.2, 50);
            }
        }
    });

    /**
     * Component to detect pinch gestures for precise card manipulation
     */
    AFRAME.registerComponent('pinch-detector', {
        schema: {
            hand: {type: 'string', default: 'right'}, // 'right' or 'left'
            debug: {type: 'boolean', default: false}  // Whether to show debug info
        },
        
        init: function() {
            // Initialize state
            this.isPinching = false;
            this.pinchTarget = null;
            
            // Set up event listeners
            this.el.addEventListener('pinchstart', this.onPinchStart.bind(this));
            this.el.addEventListener('pinchend', this.onPinchEnd.bind(this));
        },
        
        onPinchStart: function(evt) {
            // Only process events for the specified hand
            if (evt.detail.hand !== this.data.hand) return;
            
            // Set pinching state
            this.isPinching = true;
            
            // Find closest pinchable object
            const intersection = this.findClosestIntersection();
            if (intersection) {
                this.pinchTarget = intersection.object.el;
                
                // Emit event on the pinched object
                this.pinchTarget.emit('pinched', {
                    hand: this.data.hand,
                    pincher: this.el
                });
                
                if (this.data.debug) {
                    console.log(`Pinched object: ${this.pinchTarget.id || 'unnamed'}`);
                }
            }
        },
        
        onPinchEnd: function(evt) {
            // Only process events for the specified hand
            if (evt.detail.hand !== this.data.hand) return;
            
            // Reset pinching state
            this.isPinching = false;
            
            // Emit event on the previously pinched object
            if (this.pinchTarget) {
                this.pinchTarget.emit('pinchend', {
                    hand: this.data.hand,
                    pincher: this.el
                });
                
                if (this.data.debug) {
                    console.log(`Released pinched object: ${this.pinchTarget.id || 'unnamed'}`);
                }
                
                this.pinchTarget = null;
            }
        },
        
        findClosestIntersection: function() {
            // Use raycaster to find intersections
            const raycaster = this.el.components.raycaster;
            if (!raycaster) return null;
            
            // Get current intersections
            const intersections = raycaster.intersections;
            if (!intersections || intersections.length === 0) return null;
            
            // Return the closest intersection
            return intersections[0];
        }
    });

    /**
     * Component to detect various hand gestures for application control
     */
    AFRAME.registerComponent('gesture-detector', {
        schema: {
            minSwipeDistance: {type: 'number', default: 0.1},  // Minimum distance for swipe detection
            maxSwipeTime: {type: 'number', default: 500}       // Maximum time for swipe detection (ms)
        },
        
        init: function() {
            // Initialize gesture tracking
            this.startPosition = null;
            this.startTime = null;
            this.isTracking = false;
            
            // Set up event listeners
            this.el.addEventListener('pinchstart', this.onPinchStart.bind(this));
            this.el.addEventListener('pinchend', this.onPinchEnd.bind(this));
        },
        
        onPinchStart: function(evt) {
            // Start tracking gesture
            this.isTracking = true;
            this.startPosition = this.el.object3D.position.clone();
            this.startTime = Date.now();
        },
        
        onPinchEnd: function(evt) {
            // Stop tracking and check for gestures
            if (!this.isTracking) return;
            
            const endPosition = this.el.object3D.position.clone();
            const endTime = Date.now();
            
            // Check if this was a swipe gesture
            const timeDelta = endTime - this.startTime;
            if (timeDelta <= this.data.maxSwipeTime) {
                const distance = this.startPosition.distanceTo(endPosition);
                
                if (distance >= this.data.minSwipeDistance) {
                    // Calculate swipe direction
                    const direction = this.getSwipeDirection(this.startPosition, endPosition);
                    
                    // Emit swipe event
                    this.el.emit('swipe', {
                        direction: direction,
                        distance: distance,
                        duration: timeDelta
                    });
                }
            }
            
            // Reset tracking
            this.isTracking = false;
            this.startPosition = null;
            this.startTime = null;
        },
        
        getSwipeDirection: function(start, end) {
            // Calculate primary direction of swipe
            const deltaX = end.x - start.x;
            const deltaY = end.y - start.y;
            const deltaZ = end.z - start.z;
            
            // Find the axis with the largest change
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            const absDeltaZ = Math.abs(deltaZ);
            
            if (absDeltaX > absDeltaY && absDeltaX > absDeltaZ) {
                return deltaX > 0 ? 'right' : 'left';
            } else if (absDeltaY > absDeltaX && absDeltaY > absDeltaZ) {
                return deltaY > 0 ? 'up' : 'down';
            } else {
                return deltaZ > 0 ? 'forward' : 'backward';
            }
        }
    });

    console.log('Hand tracking components registered successfully');
});

// Fallback to ensure components are registered even if DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(function() {
        if (!AFRAME.components['hand-tracking-extras']) {
            console.log('Registering hand tracking components after page load');
            // Trigger the event handler manually
            window.dispatchEvent(new Event('DOMContentLoaded'));
        }
    }, 1000);
} 