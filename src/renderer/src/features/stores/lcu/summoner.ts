import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

import { SummonerInfo } from '@renderer/types/summoner'

export const useSummonerStore = defineStore('summoner', () => {
  const currentSummoner = shallowRef<SummonerInfo | null>(null)

  return {
    currentSummoner
  }
})
