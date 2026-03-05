import { DeckLevel, DeckLevelRef } from '@/models/netex/deckplan/decklevels/deckLevel'
import type { DeckPlan } from '@/models/netex/deckplan/deckPlan'
import { defineStore } from 'pinia'

export const useEditorState = defineStore('editor', {
  state: (): {
    deckplan: DeckPlan | undefined
    selectedDeckLevelId: string | undefined
    selectedElementId: string | undefined
    scale: number
  } => ({
    deckplan: undefined,
    selectedDeckLevelId: undefined,
    selectedElementId: undefined,
    scale: 10,
  }),
  getters: {
    selectedDeck: (state) =>
      state.deckplan?.decks.find(
        (deck) => deck.DeckLevelRef?.attr_ref === state.selectedDeckLevelId,
      ),
    selectedDeckId: (state) =>
      state.deckplan?.decks.find(
        (deck) => deck.DeckLevelRef?.attr_ref === state.selectedDeckLevelId,
      )?.attr_id,
    //selectedElement:
  },
  actions: {
    setDeckplan(deckplan: DeckPlan) {
      this.deckplan = deckplan
      console.log('deckplan', this.deckplan)
      // Check if Levels exist, else introduce them
      if (this.deckplan.decks.length > 0) {
        if (this.deckplan.deckLevels.length < this.deckplan.decks.length) {
          this.deckplan.decks.forEach((deck, index) => {
            let deckLevelId = `deck_level_${index}`
            if (deck.DeckLevelRef?.attr_ref) {
              deckLevelId = deck.DeckLevelRef?.attr_ref
            } else {
              deck.DeckLevelRef = new DeckLevelRef({
                attr_ref: deckLevelId,
                attr_version: '1.0',
              })
            }

            if (
              this.deckplan &&
              !this.deckplan?.deckLevels.find((deckLevel) => deckLevel.attr_id == deckLevelId)
            ) {
              this.deckplan.deckLevels.push(
                new DeckLevel({
                  Label: `Level ${index}`,
                  attr_id: deckLevelId,
                  attr_version: '1.0',
                }),
              )
            }
          })
        }
        // select Level
        this.selectedDeckLevelId = this.deckplan.decks[0]?.DeckLevelRef?.attr_ref
        console.log('selectedDeck', this.selectedDeckLevelId)
      }
    },
    addDeckLevel() {
      this.deckplan?.addDeckLevel()
    },
    removeDeckLevel() {
      if (this.selectedDeckLevelId) {
        this.deckplan?.removeDeckLevel(this.selectedDeckLevelId)
        this.selectedDeckLevelId = this.deckplan?.decks[0]?.DeckLevelRef?.attr_ref
      }
    },
    selectDeckLevel(deckLevelId: string) {
      console.log('stor', deckLevelId)
      this.selectedDeckLevelId = deckLevelId
    },
  },
})
