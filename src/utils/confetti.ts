import confetti from 'canvas-confetti';

export const throwConfetti = () => {
  confetti({
    colors: ['#00BFFF', '#1E90FF', '#87CEFA'], // Tonos azules tipo agua
    shapes: ['circle'], 
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};