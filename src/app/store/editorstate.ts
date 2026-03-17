import { DeckLevel, DeckLevelRef } from '@/models/netex/deckplan/decklevels/deckLevel'
import type { DeckPlan } from '@/models/netex/deckplan/deckPlan'
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
    selectElementToBuild(element: any) {
      this.elementToBuild = element
    },
    updateElementToBuild(updates: any) {
      if (this.elementToBuild) {
        Object.assign(this.elementToBuild, updates)
      }
    },
    moveElement(sourceId: string, targetId: string, position: 'before' | 'inside' | 'after' = 'inside') {
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
              if (typeof spot !== 'string' && 'attr_id' in spot && findElementAndParent(spot, obj, obj.passengerSpots)) return true
            }
          }
          if (obj.luggageSpots) {
            for (const spot of obj.luggageSpots) {
              if (typeof spot !== 'string' && 'attr_id' in spot && findElementAndParent(spot, obj, obj.luggageSpots)) return true
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
      const isNew = !element;
      if (isNew && this.elementToBuild && this.elementToBuild.attr_id === sourceId) {
          element = this.elementToBuild;
      }

      if (!element) return

      // 2. Resolve target parent and index
      let finalTargetId = targetId;
      let finalIndex: number | undefined = undefined;

      if (position !== 'inside') {
         // Find target's parent and target's index
         let targetParentId: string | undefined = undefined;
         let targetIndex: number | undefined = undefined;

         const findTargetParent = (obj: any, parent?: any, arr?: any[]): boolean => {
            if (obj.attr_id === targetId) {
                targetParentId = parent?.attr_id;
                targetIndex = arr?.indexOf(obj);
                return true;
            }
            if (obj.deckspaces) {
                for (const space of obj.deckspaces) {
                    if (findTargetParent(space, obj, obj.deckspaces)) return true;
                }
            }
            if (obj instanceof PassengerSpace) {
                if (obj.passengerSpots) {
                    for (const spot of obj.passengerSpots) if (typeof spot !== 'string' && 'attr_id' in spot && findTargetParent(spot, obj, obj.passengerSpots)) return true;
                }
                if (obj.luggageSpots) {
                    for (const spot of obj.luggageSpots) if (typeof spot !== 'string' && 'attr_id' in spot && findTargetParent(spot, obj, obj.luggageSpots)) return true;
                }
                if (obj.deckEntrances) {
                    for (const entrance of obj.deckEntrances) if (findTargetParent(entrance, obj, obj.deckEntrances)) return true;
                }
            }
            return false;
         };

         for (const deck of this.deckplan.decks) {
            if (findTargetParent(deck)) break;
         }

         if (targetParentId !== undefined && targetIndex !== undefined) {
             finalTargetId = targetParentId;
             finalIndex = position === 'after' ? targetIndex + 1 : targetIndex;
         }
      }

      // 3. Remove from source (if not new)
      if (!isNew && sourceArray) {
        const idx = (sourceArray as any[]).indexOf(element)
        if (idx > -1) {
          (sourceArray as any[]).splice(idx, 1)
        }
      }

      // 4. Add to target
      this.addElementToParent(element, finalTargetId, finalIndex)
    },
    addElementToParent(element: any, targetId: string, insertIndex?: number) {
      if (!this.deckplan) return

      // Find the target element and its parent container in the tree
      let target: any = undefined
      let targetParent: any = undefined
      let targetArray: any[] | undefined = undefined
      let targetIdx: number = -1

      const findTarget = (obj: any, parent?: any, arr?: any[]): boolean => {
        if (obj.attr_id === targetId) {
          target = obj
          targetParent = parent
          targetArray = arr
          targetIdx = arr ? arr.indexOf(obj) : -1
          return true
        }

        if (obj.deckspaces) {
          for (const space of obj.deckspaces) {
            if (findTarget(space, obj, obj.deckspaces)) return true
          }
        }

        if (obj instanceof PassengerSpace) {
          if (obj.passengerSpots) {
            for (const spot of obj.passengerSpots) {
              if (typeof spot !== 'string' && 'attr_id' in spot && findTarget(spot, obj, obj.passengerSpots)) return true
            }
          }
          if (obj.luggageSpots) {
            for (const spot of obj.luggageSpots) {
              if (typeof spot !== 'string' && 'attr_id' in spot && findTarget(spot, obj, obj.luggageSpots)) return true
            }
          }
          if (obj.deckEntrances) {
            for (const entrance of obj.deckEntrances) {
              if (findTarget(entrance, obj, obj.deckEntrances)) return true
            }
          }
        }
        return false
      }

      for (const deck of this.deckplan.decks) {
        if (findTarget(deck, this.deckplan, this.deckplan.decks)) break
      }

      if (!target) return

      // Determine the actual container where the element should be added
      let container = target
      let finalInsertIndex = insertIndex

      const isSpotOrEntrance = (el: any) => 
        el instanceof PassengerSpot || 
        el instanceof LuggageSpot || 
        el instanceof PassengerEntrance

      const isSpace = (el: any) => el instanceof PassengerSpace
      const isDeck = (el: any) => el instanceof Deck

      // If we are dropping onto a leaf, use its parent container
      if (isSpotOrEntrance(target)) {
        container = targetParent
        if (finalInsertIndex === undefined) {
          finalInsertIndex = targetIdx + 1 // Default to after if dropping 'inside' a leaf
        }
      }

      let arrToPush: any[] | undefined = undefined

      if (element instanceof PassengerSpot) {
        if (isSpace(container)) {
          container.passengerSpots = container.passengerSpots || []
          arrToPush = container.passengerSpots as any[]
        }
      } else if (element instanceof LuggageSpot) {
        if (isSpace(container)) {
          container.luggageSpots = container.luggageSpots || []
          arrToPush = container.luggageSpots as any[]
        }
      } else if (element instanceof PassengerEntrance) {
        if (isSpace(container)) {
          container.deckEntrances = container.deckEntrances || []
          arrToPush = container.deckEntrances as any[]
        }
      } else if (element instanceof PassengerSpace) {
        if (isDeck(container)) {
          arrToPush = container.deckspaces
        } else if (isSpace(container) || isSpotOrEntrance(container)) {
          // If trying to put a space inside another space or spot, put it next to it in the deck
          const deck = targetParent instanceof Deck ? targetParent : 
                       (targetParent instanceof PassengerSpace ? target : undefined) // flawed logic, let's refine
          // Correct container for a space dropped inside/near another space is the Deck
          let current = container
          let parentOfCurrent = targetParent
          while (current && !(current instanceof Deck) && parentOfCurrent) {
            current = parentOfCurrent
            // Find parent of current... this is why findTarget should keep a path or we just search again
          }
          // Simple fallback: spaces always go to deckspaces of their nearest Deck parent
          if (isDeck(container)) {
             arrToPush = container.deckspaces
          } else {
             // Find the deck this element belongs to
             const findDeck = (obj: any): Deck | undefined => {
                if (obj instanceof Deck) return obj
                // ... this is getting complex, let's use the deckplan decks search
                return undefined
             }
             // For now, let's use the deck found during target search if available
             // Find target's deck
             let searchDeck = undefined;
             for (const d of this.deckplan.decks) {
                const findInDeck = (obj: any): boolean => {
                    if (obj === target) return true
                    if (obj.deckspaces?.some((s: any) => findInDeck(s))) return true
                    if (obj instanceof PassengerSpace) {
                        if (obj.passengerSpots?.some((s: any) => s === target)) return true
                        if (obj.luggageSpots?.some((s: any) => s === target)) return true
                        if (obj.deckEntrances?.some((s: any) => s === target)) return true
                    }
                    return false
                }
                if (findInDeck(d)) {
                    searchDeck = d
                    break
                }
             }
             if (searchDeck) arrToPush = searchDeck.deckspaces
          }
        }
      } else if (element instanceof Deck) {
        arrToPush = this.deckplan.decks
      }

      if (arrToPush) {
        if (finalInsertIndex !== undefined) {
          arrToPush.splice(finalInsertIndex, 0, element)
        } else {
          arrToPush.push(element)
        }
      }

      this.selectElement(element.attr_id)
    },
    addElementToDeck(element: any, targetId: string) {
       this.addElementToParent(element, targetId);
       
      // Support multi-placement: create a new instance with the same properties for the next placement
      if (this.elementToBuild) {
        const item = this.elementToBuild;
        const newId = `${item.attr_id.split('_')[0]}_${Date.now()}`;
        let nextEl;

        if (item instanceof PassengerSpace) {
          nextEl = new PassengerSpace({
            ...item,
            attr_id: newId,
            passengerSpots: { PassengerSpot: [], PassengerSpotRef: [] },
            luggageSpots: { LuggageSpot: [], LuggageSpotRef: [] },
            deckEntrances: { PassengerEntrance: [] },
          } as any);
        } else if (item instanceof PassengerSpot) {
          nextEl = new PassengerSpot({
            ...item,
            attr_id: newId,
            SpotColumnRef: undefined,
            SpotRowRef: undefined,
          } as any);
        } else if (item instanceof LuggageSpot) {
          nextEl = new LuggageSpot({
            ...item,
            attr_id: newId,
            SpotColumnRef: undefined,
            SpotRowRef: undefined,
          } as any);
        } else if (item instanceof PassengerEntrance) {
          nextEl = new PassengerEntrance({
            ...item,
            attr_id: newId,
            Centroid: undefined,
          } as any);
        }
        this.elementToBuild = nextEl;
      }
    }
  },
})
