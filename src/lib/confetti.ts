// Simplified confetti implementation
export default function confetti() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // If can't get context, return early
  if (!ctx) return;
  
  // Set canvas dimensions and styles
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999';
  
  // Add canvas to document
  document.body.appendChild(canvas);
  
  // Confetti settings
  const particles: Particle[] = [];
  const particleCount = 150;
  const gravity = 0.3;
  const colors = [
    '#8b5cf6', '#ec4899', '#3b82f6', '#f97316', '#10b981', 
    '#a78bfa', '#f472b6', '#60a5fa', '#fb923c', '#34d399'
  ];
  
  // Particle class
  class Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speed: { x: number; y: number };
    rotation: number;
    rotationSpeed: number;
    shape: 'circle' | 'square' | 'triangle';
    
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height - canvas.height;
      this.size = Math.random() * 10 + 5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speed = {
        x: Math.random() * 3 - 1.5,
        y: Math.random() * 3 + 1
      };
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 5 - 2.5;
      
      // Random shape
      const shapes = ['circle', 'square', 'triangle'] as const;
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }
    
    update() {
      // Update position
      this.x += this.speed.x;
      this.y += this.speed.y;
      this.speed.y += gravity;
      
      // Update rotation
      this.rotation += this.rotationSpeed;
      
      // Remove when out of screen
      if (this.y > canvas.height) {
        return false;
      }
      
      return true;
    }
    
    draw() {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      
      ctx.fillStyle = this.color;
      
      switch(this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'square':
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      ctx.restore();
    }
  }
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation loop
  function animate() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].update()) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }
    
    // Stop animation when all particles are gone
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      // Remove canvas when animation is complete
      canvas.remove();
    }
  }
  
  // Start animation
  animate();
}