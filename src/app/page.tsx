'use client'

import { useEffect } from 'react'
import GameBoard from '@/components/GameBoard'
import GameMenu from '@/components/GameMenu'
import LevelSelector from '@/components/LevelSelector'
import Statistics from '@/components/Statistics'
import { useGameStore } from '@/store/gameStore'

export default function Home() {
  const { currentView, initializeGame } = useGameStore()

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {currentView === 'menu' && <GameMenu />}
        {currentView === 'game' && <GameBoard />}
        {currentView === 'levels' && <LevelSelector />}
        {currentView === 'stats' && <Statistics />}
      </div>
    </main>
  )
}