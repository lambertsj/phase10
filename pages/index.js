import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const existingPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    if (existingPlayers.length > 0) {
      setPlayers(existingPlayers);
      setPlayerCount(existingPlayers.length);
    } else {
      setPlayers(Array(2).fill(''));
    }
  }, []);

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validPlayers = players.filter(name => name.trim() !== '');
    if (validPlayers.length >= 2) {
      localStorage.setItem('players', JSON.stringify(validPlayers));
      router.push('/game');
    } else {
      alert('Please enter at least 2 player names.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Phase 10 Scorekeeper</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Number of Players:</label>
          <input
            type="number"
            min="2"
            max="6"
            value={playerCount}
            onChange={(e) => {
              const count = parseInt(e.target.value);
              setPlayerCount(count);
              setPlayers(prev => {
                const newPlayers = [...prev];
                if (count > prev.length) {
                  newPlayers.push(...Array(count - prev.length).fill(''));
                } else {
                  newPlayers.splice(count);
                }
                return newPlayers;
              });
            }}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        {players.map((player, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Player ${index + 1} nickname`}
              value={player}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          {players.some(p => p.trim() !== '') ? 'Continue Game' : 'Start Game'}
        </button>
      </form>
    </div>
  );
}