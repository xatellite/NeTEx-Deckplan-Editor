import { DeckLevel, DeckLevelRef } from '@/models/netex/deckplan/decklevels/deckLevel'
import type { DeckPlan } from '@/models/netex/deckplan/deckPlan'
import { defineStore } from 'pinia'
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace'

export const useEditorState = defineStore('editor', {
  state: (): {
    deckplan: DeckPlan | undefined
    selectedDeckLevelId: string | undefined
    selectedElementId: string | undefined
    scale: number
    activeTool: 'deckspace' | 'spot' | 'entrance' | undefined
    activeEquipment: string | undefined
  } => ({
    deckplan: undefined,
    selectedDeckLevelId: undefined,
    selectedElementId: undefined,
    scale: 10,
    activeTool: undefined,
    activeEquipment: undefined,
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
    selectedElement: (state) => {
      if (!state.deckplan || !state.selectedElementId) return undefined
      
      // Search in decks
      for (const deck of state.deckplan.decks) {
        if (deck.attr_id === state.selectedElementId) return deck
        
        // Search in deckspaces
        for (const space of deck.deckspaces) {
          if (space.attr_id === state.selectedElementId) return space
          
          if (space instanceof PassengerSpace) {
            // Search in spots
            if (space.passengerSpots) {
              for (const spot of space.passengerSpots) {
                if (typeof spot !== 'string' && 'attr_id' in spot && spot.attr_id === state.selectedElementId) return spot
              }
            }
            if (space.luggageSpots) {
              for (const spot of space.luggageSpots) {
                if (typeof spot !== 'string' && 'attr_id' in spot && spot.attr_id === state.selectedElementId) return spot
              }
            }
            // Search in entrances
            if (space.deckEntrances) {
              for (const entrance of space.deckEntrances) {
                if (entrance.attr_id === state.selectedElementId) return entrance
              }
            }
          }
        }
      }
      return undefined
    },
  },
  actions: {
    updateElement(elementId: string, updates: any) {
      if (!this.deckplan) return
      
      // We need to find the element in the tree. 
      // This is a bit expensive but ensures consistency.
      const findAndUpdate = (obj: any): boolean => {
        if (obj.attr_id === elementId) {
          Object.assign(obj, updates)
          return true
        }
        
        if (obj.deckspaces) {
          for (const space of obj.deckspaces) {
            if (findAndUpdate(space)) return true
          }
        }
        
        if (obj instanceof PassengerSpace) {
          if (obj.passengerSpots) {
            for (const spot of obj.passengerSpots) {
              if (typeof spot !== 'string' && findAndUpdate(spot)) return true
            }
          }
          if (obj.luggageSpots) {
            for (const spot of obj.luggageSpots) {
              if (typeof spot !== 'string' && findAndUpdate(spot)) return true
            }
          }
          if (obj.deckEntrances) {
            for (const entrance of obj.deckEntrances) {
              if (findAndUpdate(entrance)) return true
            }
          }
        }
        return false
      }

      for (const deck of this.deckplan.decks) {
        if (findAndUpdate(deck)) break
      }
    },
    setActiveTool(tool: 'deckspace' | 'spot' | 'entrance' | undefined, equipment?: string) {
      this.activeTool = tool
      this.activeEquipment = equipment
    },
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
    selectElement(elementId: string | undefined) {
      this.selectedElementId = elementId
    },
  },
})
