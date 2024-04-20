import { mainStateSync } from '@renderer/utils/ipc'

import { useAppStore } from '../app/store'
import { useChampSelectStore } from './champ-select'
import { useChatStore } from './chat'
import { useGameDataStore } from './game-data'
import { useGameflowStore } from './gameflow'
import { useLobbyStore } from './lobby'
import { useSummonerStore } from './summoner'

export const id = 'core:lcu-state-update'

// 处理 App 和 LCU 的状态更新
export async function setupStateUpdater() {
  lcuConnectionStateSync()

  gameflowSync()

  summonerSync()

  lobbySync()

  chatSync()

  champSelectSync()

  gameDataSync()
}

function lcuConnectionStateSync() {
  const app = useAppStore()

  mainStateSync('lcu-connection/auth', (s) => (app.lcuAuth = s))
  mainStateSync('lcu-connection/state', (s) => (app.lcuConnectionState = s))
}

function gameflowSync() {
  const gameflow = useGameflowStore()

  mainStateSync('lcu/gameflow/phase', (s) => (gameflow.phase = s))
}

function summonerSync() {
  const summoner = useSummonerStore()

  mainStateSync('lcu/summoner/me', (s) => (summoner.me = s))
}

function lobbySync() {
  const lobby = useLobbyStore()

  mainStateSync('lcu/lobby/lobby', (s) => (lobby.lobby = s))
}

function chatSync() {
  const chat = useChatStore()

  mainStateSync('lcu/chat/me', (s) => (chat.me = s))

  mainStateSync(
    'lcu/chat/conversations/champ-select',
    (s) => (chat.conversations.championSelect = s)
  )

  mainStateSync('lcu/chat/conversations/post-game', (s) => (chat.conversations.postGame = s))
}

function champSelectSync() {
  const champSelect = useChampSelectStore()

  mainStateSync('lcu/champ-select/session', (s) => (champSelect.session = s))

  mainStateSync('lcu/champ-select/pickable-champion-ids', (s: number[]) => {
    champSelect.currentPickableChampions.clear()
    s.forEach((c) => champSelect.currentPickableChampions.add(c))
  })

  mainStateSync('lcu/champ-select/bannable-champion-ids', (s: number[]) => {
    champSelect.currentBannableChampions.clear()
    s.forEach((c) => champSelect.currentBannableChampions.add(c))
  })
}

function gameDataSync() {
  const gameData = useGameDataStore()

  mainStateSync('lcu/game-data/augments', (s) => (gameData.augments = s))
  mainStateSync('lcu/game-data/champions', (s) => (gameData.champions = s))
  mainStateSync('lcu/game-data/items', (s) => (gameData.items = s))
  mainStateSync('lcu/game-data/perks', (s) => (gameData.perks = s))
  mainStateSync('lcu/game-data/perkstyles', (s) => (gameData.perkstyles = s))
  mainStateSync('lcu/game-data/queues', (s) => (gameData.queues = s))
  mainStateSync('lcu/game-data/summoner-spells', (s) => (gameData.summonerSpells = s))
}