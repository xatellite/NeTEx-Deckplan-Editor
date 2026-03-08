<template>
  <div class="bg-white flex flex-col gap-4 scrollbar-thin overflow-y-auto">
    <div class="grid grid-cols-2 gap-x-6 gap-y-4">
      <div v-for="(field, key) in editableFields" :key="key" class="flex flex-col gap-1.5">
        <label :for="key" class="text-[11px] font-semibold text-ott-text-secondary uppercase tracking-wide">
          {{ formatLabel(key) }}
        </label>

        <!-- Enum / Select -->
        <select
          v-if="field.type === 'enum'"
          :id="key"
          :value="field.value"
          @change="(e) => handleUpdate(key, (e.target as HTMLSelectElement).value)"
          class="ott-input w-full bg-ott-bg-secondary border-transparent hover:border-ott-bg-dark focus:bg-white transition-all appearance-none"
        >
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>

        <!-- Boolean / Toggle -->
        <div v-else-if="field.type === 'boolean'" class="flex items-center h-8">
          <input
            type="checkbox"
            :id="key"
            :checked="field.value"
            @change="(e) => handleUpdate(key, (e.target as HTMLInputElement).checked)"
            class="w-4 h-4 rounded border-ott-bg-dark text-ott-accent focus:ring-ott-accent cursor-pointer"
          />
        </div>

        <!-- Number -->
        <input
          v-else-if="field.type === 'number'"
          type="number"
          :id="key"
          :value="field.value"
          @input="(e) => handleUpdate(key, parseFloat((e.target as HTMLInputElement).value))"
          class="ott-input w-full bg-ott-bg-secondary border-transparent hover:border-ott-bg-dark focus:bg-white transition-all"
        />

        <!-- Text -->
        <input
          v-else
          type="text"
          :id="key"
          :value="field.value"
          @input="(e) => handleUpdate(key, (e.target as HTMLInputElement).value)"
          class="ott-input w-full bg-ott-bg-secondary border-transparent hover:border-ott-bg-dark focus:bg-white transition-all"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PassengerSpace } from '@/models/netex/deckplan/deck/deckspace/passengerSpace';
import { PassengerSpot } from '@/models/netex/deckplan/deck/deckspace/spots/passengerSpot';
import { PassengerEntrance } from '@/models/netex/deckplan/deck/deckspace/entrance/passengerEntrance';

const props = defineProps({
  element: {
    type: Object as any,
    required: true
  }
});

const emit = defineEmits(['update']);

const editableFields = computed(() => {
  const fields: Record<string, any> = {};
  const el = props.element;

  // Basic identification
  if ('Label' in el) fields.Label = { type: 'text', value: el.Label };
  if ('Name' in el) {
    const val = typeof el.Name === 'string' ? el.Name : (el.Name?.value || el.Name?.text_value || '');
    fields.Name = { type: 'text', value: val };
  }

  // Common properties
  if ('PublicUse' in el) fields.PublicUse = { type: 'boolean', value: !!el.PublicUse };
  if ('TotalCapacity' in el) fields.TotalCapacity = { type: 'number', value: el.TotalCapacity };
  if ('Width' in el) fields.Width = { type: 'number', value: el.Width };
  if ('Length' in el) fields.Length = { type: 'number', value: el.Length };


  // Specific properties
  if (el instanceof PassengerSpot) {
    if ('Orientation' in el) {
      fields.Orientation = {
        type: 'enum',
        value: el.Orientation,
        options: [undefined, 'forward', 'backward', 'toleft', 'toright']
      };
    }
    fields.HasPower = { type: 'boolean', value: !!el.HasPower };
    fields.IsByAisle = { type: 'boolean', value: !!el.IsByAisle };
    fields.IsBetweenSeats = { type: 'boolean', value: !!el.IsBetweenSeats };
    fields.IsByWindow = { type: 'boolean', value: !!el.IsByWindow };
    fields.TableType = { type: 'enum',
        value: el.TableType,
        options: [undefined, 'frontseat', 'seperate', 'slideout'] };
  }

  if (el instanceof PassengerSpace) {
    if ('PassengerSpaceType' in el) {
      fields.PassengerSpaceType = {
        type: 'enum',
        value: el.PassengerSpaceType,
        options: ['seatingArea', 'passengerCabin', 'vehicleArea', 'luggageStore', 'corridor', 'restaurant', 'toilet', 'bathroom', 'other']
      };
    }
  }

  if (el instanceof PassengerEntrance) {
      if ('VehicleSide' in el) {
          fields.VehicleSide = {
              type: 'enum',
              value: el.VehicleSide,
              options: ['leftSide', 'rightSide', 'front', 'back', 'bothSides', 'unspecified']
          }
      }
  }

  return fields;
});

const handleUpdate = (key: string, value: any) => {
  const updates: Record<string, any> = {};
  updates[key] = value;
  emit('update', updates);
};

const formatLabel = (key: string) => {
  return key.replace(/([A-Z])/g, ' $1').trim();
};
</script>
