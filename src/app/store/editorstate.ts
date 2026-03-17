import { DeckLevel, DeckLevelRef } from '@/models/netex/deckplan/decklevels/deckLevel'
import type { BuildableElement, DeckPlan } from '@/models/netex/deckplan/deckPlan'
import { defineStore } from 'pinia'
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace'
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot'
import { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot'
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance'
import { Deck } from '@/models/netex/deckplan/deck/deck'

export const useEditorState = defineStore('editor', {
  state: (): {
    deckplan: DeckPlan | undefined
    selectedDeckLevelId: string | undefined
    selectedElementId: string | undefined
    scale: number
    activeTool: 'deckspace' | 'spot' | 'entrance' | undefined
    activeEquipment: string | undefined
    elementToBuild: any | undefined
  } => ({
    deckplan: undefined,
    selectedDeckLevelId: undefined,
    selectedElementId: undefined,
    scale: 10,
    activeTool: undefined,
    activeEquipment: undefined,
    elementToBuild: undefined,
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
                if (
                  typeof spot !== 'string' &&
                  'attr_id' in spot &&
                  spot.attr_id === state.selectedElementId
                )
                  return spot
              }
            }
            if (space.luggageSpots) {
              for (const spot of space.luggageSpots) {
                if (
                  typeof spot !== 'string' &&
                  'attr_id' in spot &&
                  spot.attr_id === state.selectedElementId
                )
                  return spot
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
    selectElementToBuild(element: any) {
      this.elementToBuild = element
    },
    updateElementToBuild(updates: any) {
      if (this.elementToBuild) {
        Object.assign(this.elementToBuild, updates)
      }
    },
    moveElement(
      sourceId: string,
      targetId: string,
      position: 'before' | 'inside' | 'after' = 'inside',
    ) {
      if (!this.deckplan) return

      // 1. Find the source element and its parent array
      let element: any = undefined
      let sourceArray: any[] | undefined = undefined

      const findElementAndParent = (obj: any, parent?: any, arr?: any[]): boolean => {
        if (obj.attr_id === sourceId) {
          element = obj
          sourceArray = arr
          return true
        }

        if (obj.deckspaces) {
          for (const space of obj.deckspaces) {
            if (findElementAndParent(space, obj, obj.deckspaces)) return true
          }
        }

        if (obj instanceof PassengerSpace) {
          if (obj.passengerSpots) {
            for (const spot of obj.passengerSpots) {
              if (
                typeof spot !== 'string' &&
                'attr_id' in spot &&
                findElementAndParent(spot, obj, obj.passengerSpots)
              )
                return true
            }
          }
          if (obj.luggageSpots) {
            for (const spot of obj.luggageSpots) {
              if (
                typeof spot !== 'string' &&
                'attr_id' in spot &&
                findElementAndParent(spot, obj, obj.luggageSpots)
              )
                return true
            }
          }
          if (obj.deckEntrances) {
            for (const entrance of obj.deckEntrances) {
              if (findElementAndParent(entrance, obj, obj.deckEntrances)) return true
            }
          }
        }
        return false
      }

      for (const deck of this.deckplan.decks) {
        if (findElementAndParent(deck, this.deckplan, this.deckplan.decks)) break
      }

      // Special case: if isNewElement (sourceId doesn't exist yet)
      const isNew = !element
      if (isNew && this.elementToBuild && this.elementToBuild.attr_id === sourceId) {
        element = this.elementToBuild
      }

      if (!element) return

      // 2. Resolve target parent and index
      let finalTargetId = targetId
      let finalIndex: number | undefined = undefined

      if (position !== 'inside') {
        // Find target's parent and target's index
        let targetParentId: string | undefined = undefined
        let targetIndex: number | undefined = undefined

        const findTargetParent = (obj: any, parent?: any, arr?: any[]): boolean => {
          if (obj.attr_id === targetId) {
            targetParentId = parent?.attr_id
            targetIndex = arr?.indexOf(obj)
            return true
          }
          if (obj.deckspaces) {
            for (const space of obj.deckspaces) {
              if (findTargetParent(space, obj, obj.deckspaces)) return true
            }
          }
          if (obj instanceof PassengerSpace) {
            if (obj.passengerSpots) {
              for (const spot of obj.passengerSpots)
                if (
                  typeof spot !== 'string' &&
                  'attr_id' in spot &&
                  findTargetParent(spot, obj, obj.passengerSpots)
                )
                  return true
            }
            if (obj.luggageSpots) {
              for (const spot of obj.luggageSpots)
                if (
                  typeof spot !== 'string' &&
                  'attr_id' in spot &&
                  findTargetParent(spot, obj, obj.luggageSpots)
                )
                  return true
            }
            if (obj.deckEntrances) {
              for (const entrance of obj.deckEntrances)
                if (findTargetParent(entrance, obj, obj.deckEntrances)) return true
            }
          }
          return false
        }

        for (const deck of this.deckplan.decks) {
          if (findTargetParent(deck)) break
        }

        if (targetParentId !== undefined && targetIndex !== undefined) {
          finalTargetId = targetParentId
          finalIndex = position === 'after' ? targetIndex + 1 : targetIndex
        }
      }

      // 3. Remove from source (if not new)
      if (!isNew && sourceArray) {
        const idx = (sourceArray as any[]).indexOf(element)
        if (idx > -1) {
          ;(sourceArray as any[]).splice(idx, 1)
        }
      }

      // 4. Add to target
      this.addElementToParent(element, finalTargetId, finalIndex)
    },
    addElementToParent(element: BuildableElement, targetId: string, insertIndex?: number) {
      if (!this.deckplan) return

      console.log('Adding element', element, 'to target', targetId, 'at index', insertIndex)

      // 1. Find the target and its context (Deck and optionally PassengerSpace)
      let foundTarget: any = undefined
      let foundDeck: Deck | undefined = undefined
      let foundSpace: PassengerSpace | undefined = undefined

      const search = (obj: any, currentDeck?: Deck, currentSpace?: PassengerSpace): boolean => {
        if (obj.attr_id === targetId) {
          foundTarget = obj
          foundDeck = currentDeck
          foundSpace = currentSpace
          return true
        }

        if (obj instanceof Deck) {
          for (const space of obj.deckspaces) {
            if (search(space, obj)) return true
          }
        } else if (obj instanceof PassengerSpace) {
          const spots = [
            ...(obj.passengerSpots || []),
            ...(obj.luggageSpots || []),
            ...(obj.deckEntrances || []),
          ]
          for (const spot of spots) {
            if (typeof spot !== 'string' && search(spot, currentDeck, obj)) return true
          }
        }
        return false
      }

      for (const deck of this.deckplan.decks) {
        if (search(deck, deck)) break
      }

      if (!foundDeck) {
        console.warn('Target deck not found for ID:', targetId)
        return
      }

      const targetDeck = foundDeck as Deck
      const target = foundTarget
      const targetSpace = foundSpace

      // 2. Determine target array and container based on element type and target context
      let arrToPush: any[] | undefined = undefined

      if (element instanceof Deck) {
        arrToPush = this.deckplan.decks
      } else if (element instanceof PassengerSpace) {
        // Spaces always go to the Deck
        arrToPush = targetDeck.deckspaces
      } else if (
        element instanceof PassengerSpot ||
        element instanceof LuggageSpot ||
        element instanceof PassengerEntrance
      ) {
        // Spots/Entrances go to a PassengerSpace
        let space: PassengerSpace | undefined = targetSpace
        if (target instanceof PassengerSpace) {
          space = target
        }

        if (!space) {
          const existingSpace = targetDeck.deckspaces.find(
            (s: any): s is PassengerSpace => s instanceof PassengerSpace,
          )
          if (existingSpace) {
            space = existingSpace
          } else {
            space = PassengerSpace.createDefault(`space_${Date.now()}`)
            targetDeck.deckspaces.push(space)
          }
        }

        if (space) {
          if (element instanceof PassengerSpot) {
            space.passengerSpots = space.passengerSpots || []
            arrToPush = space.passengerSpots as any[]
          } else if (element instanceof LuggageSpot) {
            space.luggageSpots = space.luggageSpots || []
            arrToPush = space.luggageSpots as any[]
          } else if (element instanceof PassengerEntrance) {
            space.deckEntrances = space.deckEntrances || []
            arrToPush = space.deckEntrances as any[]
          }
        }
      }

      // 3. Insert element
      if (arrToPush) {
        if (insertIndex !== undefined && insertIndex >= 0) {
          arrToPush.splice(insertIndex, 0, element)
        } else {
          arrToPush.push(element)
        }
      }

      if (element && element.attr_id) {
        this.selectElement(element.attr_id)
      }
    },
    addElementToDeck(element: BuildableElement, targetId: string) {
      this.addElementToParent(element, targetId)

      // Support multi-placement: create a new instance with the same properties for the next placement
      if (this.elementToBuild) {
        const item = this.elementToBuild
        const newId = `${item.attr_id.split('_')[0]}_${Date.now()}`
        let nextEl

        if (item instanceof PassengerSpace) {
          nextEl = new PassengerSpace({
            ...item,
            attr_id: newId,
            passengerSpots: { PassengerSpot: [], PassengerSpotRef: [] },
            luggageSpots: { LuggageSpot: [], LuggageSpotRef: [] },
            deckEntrances: { PassengerEntrance: [] },
          } as any)
        } else if (item instanceof PassengerSpot) {
          nextEl = new PassengerSpot({
            ...item,
            attr_id: newId,
            SpotColumnRef: undefined,
            SpotRowRef: undefined,
          } as any)
        } else if (item instanceof LuggageSpot) {
          nextEl = new LuggageSpot({
            ...item,
            attr_id: newId,
            SpotColumnRef: undefined,
            SpotRowRef: undefined,
          } as any)
        } else if (item instanceof PassengerEntrance) {
          nextEl = new PassengerEntrance({
            ...item,
            attr_id: newId,
            Centroid: undefined,
          } as any)
        }
        this.elementToBuild = nextEl
      }
    },
  },
})
