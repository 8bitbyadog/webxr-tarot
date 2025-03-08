AFRAME.registerComponent('controller-interaction', {
  init: function() {
    this.grabbedCard = null;
    
    // Listen for controller events
    this.el.addEventListener('triggerdown', this.onTriggerDown.bind(this));
    this.el.addEventListener('triggerup', this.onTriggerUp.bind(this));
  },

  onTriggerDown: function(evt) {
    const intersection = this.el.components.raycaster.getIntersection('.interactive');
    if (intersection) {
      this.grabbedCard = intersection.object.el;
      // Add visual feedback for grabbed card
      this.grabbedCard.setAttribute('material', 'color', '#ffff00');
    }
  },

  onTriggerUp: function() {
    if (this.grabbedCard) {
      // Reset card appearance
      this.grabbedCard.setAttribute('material', 'color', '#ffffff');
      this.grabbedCard = null;
    }
  },

  tick: function() {
    if (this.grabbedCard) {
      // Update card position to follow controller
      const controllerPosition = this.el.object3D.position;
      this.grabbedCard.object3D.position.copy(controllerPosition);
    }
  }
}); 