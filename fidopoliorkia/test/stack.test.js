
const { info, move } = require('../../index.js');

describe('Battlesnake Tests', () => {
  test('info function returns the correct snake configuration', () => {
    expect(info()).toEqual({
      apiversion: '1',
      author: '',
      color: '#cc0066',
      head: 'snow-worm',
      tail: 'block-bum',
    });
  });

  describe('move function', () => {
    test('should not move in the opposite direction of the neck', () => {
      const gameState = {
        you: { body: [{ x: 0, y: 0 }, { x: 1, y: 0 }] },
        // ... other necessary gameState properties
      };

      const response = move(gameState);
      expect(response.move).not.toBe('left');
    });

    // Add more tests to check for avoiding walls, avoiding itself, etc.
    // Example:
    test('should not move left if on the left edge of the board', () => {
      const gameState = {
        you: { body: [{ x: 0, y: 0 }, { x: 0, y: 1 }] },
        board: { width: 11, height: 11 },
        // ... other necessary gameState properties
      };

      const response = move(gameState);
      expect(response.move).not.toBe('left');
    });

    // Similarly, add tests for avoiding collision with itself and other snakes.
  });
  describe('start', () => {
    it('should log "GAME START"', () => {
      start({});
      expect(console.log).toHaveBeenCalledWith('GAME START');
    });
  });



  describe('end', () => {
    it('should log "GAME OVER"', () => {
      end({});
      expect(console.log).toHaveBeenCalledWith('GAME OVER\n');
    });
  });
});
