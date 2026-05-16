import { DeckLevel, DeckLevelRef } from '@/models/netex/deckplan/decklevels/deckLevel'
import type { BuildableElement, DeckPlan } from '@/models/netex/deckplan/deckPlan'
import { defineStore } from 'pinia'
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace'
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot'
import { LuggageSpot } from '@/models/netex/deckplan/deck/deckspace/spots/luggageSpot'
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance'
import { Deck } from '@/models/netex/deckplan/deck/deck'
import type { PassengerEquipment } from '@/models/netex/passengerEquipment'

export const useEditorState = defineStore('editor', {
  state: (): {
    deckplan: DeckPlan | undefined
    equipments: PassengerEquipment[]
    wrapper: object | undefined
    selectedDeckLevelId: string | undefined
    selectedElementIds: string[]
    scale: number
    activeTool: 'deckspace' | 'spot' | 'entrance' | undefined
    activeEquipment: string | undefined
    elementToBuild: any | undefined
  } => ({
    deckplan: undefined,
    equipments: [],
    wrapper: undefined,
    selectedDeckLevelId: undefined,
    selectedElementIds: [],
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
      if (!state.deckplan || state.selectedElementIds.length === 0) return undefined
      const id = state.selectedElementIds[0]

      // Search helper
      const findById = (elements: any[], targetId: string): any => {
        for (const el of elements) {
          if (el.attr_id === targetId) return el
          if (el.deckspaces) {
            const found = findById(el.deckspaces, targetId)
            if (found) return found
          }
          if (el instanceof PassengerSpace) {
            const spots = [
              ...(el.passengerSpots || []),
              ...(el.luggageSpots || []),
              ...(el.deckEntrances || []),
            ]
            for (const s of spots) {
              if (typeof s !== 'string' && 'attr_id' in s && s.attr_id === targetId) return s
            }
          }
        }
        return undefined
      }

      return findById(state.deckplan.decks, id)
    },
    selectedElements: (state) => {
      if (!state.deckplan || state.selectedElementIds.length === 0) return []

      const findById = (elements: any[], targetId: string): any => {
        for (const el of elements) {
          if (el.attr_id === targetId) return el
          if (el.deckspaces) {
            const found = findById(el.deckspaces, targetId)
            if (found) return found
          }
          if (el instanceof PassengerSpace) {
            const spots = [
              ...(el.passengerSpots || []),
              ...(el.luggageSpots || []),
              ...(el.deckEntrances || []),
            ]
            for (const s of spots) {
              if (typeof s !== 'string' && 'attr_id' in s && s.attr_id === targetId) return s
            }
          }
        }
        return undefined
      }

      return state.selectedElementIds
        .map((id) => findById(state.deckplan!.decks, id))
        .filter((el) => el !== undefined)
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
    setDeckplan([deckplan, wrapper]: [DeckPlan, object | undefined]) {
      this.deckplan = deckplan
      this.wrapper = wrapper
      console.log(this.deckplan)
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
      }
    },
    setEquipments(equipments: PassengerEquipment[]) {
      this.equipments = equipments
    },
    addEquipment(equipment: PassengerEquipment) {
      this.equipments.push(equipment)
    },
    updateEquipment(equipmentId: string, updates: Partial<PassengerEquipment>) {
      const equipment = this.equipments.find((e) => e.attr_id === equipmentId)
      if (equipment) {
        Object.assign(equipment, updates)
      }
    },
    deleteEquipment(equipmentId: string) {
      this.equipments = this.equipments.filter((e) => e.attr_id !== equipmentId)
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
      this.selectedDeckLevelId = deckLevelId
    },
    selectElement(elementId: string | undefined, ctrlKey = false) {
      if (!elementId) {
        this.selectedElementIds = []
        return
      }

      if (ctrlKey) {
        const index = this.selectedElementIds.indexOf(elementId)
        if (index > -1) {
          this.selectedElementIds.splice(index, 1)
        } else {
          this.selectedElementIds.push(elementId)
        }
      } else {
        this.selectedElementIds = [elementId]
      }
    },
    selectElements(elementIds: string[]) {
      this.selectedElementIds = elementIds
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
    deleteElement(elementId: string) {
      if (!this.deckplan) return

      const findAndRemove = (obj: any, parent?: any, arr?: any[]): boolean => {
        if (obj.attr_id === elementId) {
          if (arr) {
            const idx = arr.indexOf(obj)
            if (idx > -1) {
              arr.splice(idx, 1)
              return true
            }
          }
        }

        if (obj.deckspaces) {
          for (const space of obj.deckspaces) {
            if (findAndRemove(space, obj, obj.deckspaces)) return true
          }
        }

        if (obj instanceof PassengerSpace) {
          if (obj.passengerSpots) {
            for (const spot of obj.passengerSpots) {
              if (typeof spot !== 'string' && findAndRemove(spot, obj, obj.passengerSpots))
                return true
            }
          }
          if (obj.luggageSpots) {
            for (const spot of obj.luggageSpots) {
              if (typeof spot !== 'string' && findAndRemove(spot, obj, obj.luggageSpots))
                return true
            }
          }
          if (obj.deckEntrances) {
            for (const entrance of obj.deckEntrances) {
              if (findAndRemove(entrance, obj, obj.deckEntrances)) return true
            }
          }
        }
        return false
      }

      for (const deck of this.deckplan.decks) {
        if (findAndRemove(deck, this.deckplan, this.deckplan.decks)) break
      }

      this.selectedElementIds = this.selectedElementIds.filter((id) => id !== elementId)
    },
  },
})
