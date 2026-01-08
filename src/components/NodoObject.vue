<template>
  <div class="demo ripple" 
    @mousedown="startDrag"
    @touchstart="startDrag"
    :style="{ transform: `translate(${x}px, ${y}px)` }"
  >
    <div class="content">
       <!-- <img class="h-100 w-100" src="https://i.pinimg.com/736x/a7/f3/64/a7f3649371d8c8b89fa7b5616e50c252.jpg"></img> -->
        1
    </div>
  </div>
</template>

<script>
export default {
  name: 'NodoObject',
  data() {
    return {
      isAnimating: false,
      isDragging: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0
    };
  },
  mounted() {
    this.startAnimation();
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('touchmove', this.onDrag);
    document.addEventListener('touchend', this.stopDrag);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('touchmove', this.onDrag);
    document.removeEventListener('touchend', this.stopDrag);
  },
  methods: {
    startAnimation() {
      this.isAnimating = true;
      this.$el.classList.add('anim-ripple');
    },
    stopAnimation() {
      this.isAnimating = false;
      this.$el.classList.remove('anim-ripple');
    },
    startDrag(e) {
      this.isDragging = true;
      const rect = this.$el.getBoundingClientRect();
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      this.offsetX = clientX - rect.left;
      this.offsetY = clientY - rect.top;
      this.startX = clientX;
      this.startY = clientY;
    },
    onDrag(e) {
      if (!this.isDragging) return;
      
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      this.x += clientX - this.startX;
      this.y += clientY - this.startY;
      
      this.startX = clientX;
      this.startY = clientY;
    },
    stopDrag() {
      this.isDragging = false;
    }
  }
};
</script>

<style>
.demo{
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  width: 56px;
  height: 56px;
  overflow: hidden;
  border-radius: 14px;
  z-index: 10;
  position: absolute;
  animation: ripple 1.6s 0.4s ease-out infinite;
}

.demo content{
  position: relative;
  z-index: -1;
}

.demo:active {
  cursor: grabbing;
}

@keyframes ripple {
  from {
    box-shadow: 0 0 0 0 #63d2ff73;
  }
  to {
    box-shadow: 0 0 0 22px #63d2ff00;
  }
}
</style>