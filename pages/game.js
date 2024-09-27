import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Game() {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [playerData, setPlayerData] = useState({});
  const [currentDealer, setCurrentDealer] = useState(null);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players') || '[]');
    setPlayers(storedPlayers);
    const storedPlayerData = JSON.parse(localStorage.getItem('playerData') || '{}');
    const initialPlayerData = storedPlayers.reduce((acc, player) => {
      acc[player] = storedPlayerData[player] || { score: 0, phase: 1 };
      return acc;
    }, {});
    setPlayerData(initialPlayerData);
    setCurrentDealer(localStorage.getItem('currentDealer') || null);
  }, []);

  const updatePlayerData = (player, field, value) => {
    setPlayerData(prevData => {
      const newData = {
        ...prevData,
        [player]: {
          ...prevData[player],
          [field]: field === 'score' ? prevData[player].score + parseInt(value || 0) : parseInt(value)
        }
      };
      localStorage.setItem('playerData', JSON.stringify(newData));
      return newData;
    });
  };

  const setDealer = (player) => {
    setCurrentDealer(player);
    localStorage.setItem('currentDealer', player);
  };

  const PhaseButtons = ({ player }) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[...Array(10)].map((_, index) => (
          <button
            key={index}
            onClick={() => updatePlayerData(player, 'phase', index + 1)}
            className={`w-8 h-8 rounded-full ${
              playerData[player]?.phase === index + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  const goToFirstScreen = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Phase 10 Scorekeeper</h1>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Current Dealer</h2>
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <button
              key={player}
              onClick={() => setDealer(player)}
              className={`px-3 py-1 rounded ${
                currentDealer === player
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {player}
            </button>
          ))}
        </div>
      </div>
      {players.map((player) => (
        <div key={player} className="mb-8 p-4 border rounded shadow">
          <h2 className="text-xl font-bold mb-2 text-center">
            {player}
            {currentDealer === player && ' (Dealer)'}
          </h2>
          <PhaseButtons player={player} />
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg">Current Phase:</span>
            <span className="text-lg font-bold">{playerData[player]?.phase || 1}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg">Score:</span>
            <span className="text-lg font-bold">{playerData[player]?.score || 0} pts</span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              placeholder="Points"
              className="border rounded px-2 py-1 w-full mr-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  updatePlayerData(player, 'score', e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <button
              onClick={(e) => {
                const pointsInput = e.target.previousSibling;
                updatePlayerData(player, 'score', pointsInput.value);
                pointsInput.value = '';
              }}
              className="bg-green-500 text-white px-4 py-2 rounded whitespace-nowrap"
            >
              Add Points
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={goToFirstScreen}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
      >
        Add Players / Edit Game
      </button>
    </div>
  );
}