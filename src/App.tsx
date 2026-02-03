import { GameBoard } from './components/GameBoard'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="game-title">
          <span className="title-candy">🍬</span>
          Candy Crush
          <span className="title-sparkle">✨</span>
        </h1>
        <p className="game-subtitle">3개 이상 맞춰서 터뜨리세요!</p>
      </header>
      <main className="app-main">
        <GameBoard />
      </main>
    </div>
  )
}

export default App
