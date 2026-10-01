<template>
  <div class="h-full flex flex-col bg-ott-bg-secondary text-ott-text-primary p-6 overflow-auto">
    <div class="flex flex-col justify-between gap-2 mb-8">
      <div>
        <h2 class="text-2xl font-bold m-0!">Equipments</h2>
        <p class="text-ott-text-secondary">Manage defined equipments for the vehicle.</p>
      </div>
      <div class="flex gap-2">
        <button 
          v-for="type in equipmentTypes" 
          :key="type.name"
          @click="addNewEquipment(type.class)"
          class="ott-button ott-button--accent flex items-center gap-2"
        >
          <Icon :icon="type.icon" />
          Add {{ type.label }}
        </button>
      </div>
    </div>

    <div v-if="equipments.length === 0" class="flex-1 flex flex-col items-center justify-center text-ott-text-secondary border-2 border-dashed border-ott-bg-dark rounded-xl p-12">
      <Icon icon="material-symbols:Home-Repair-Service-outline" width="64" class="mb-4 opacity-20" />
      <p class="text-lg">No equipments defined yet.</p>
      <p class="text-sm">Click one of the buttons above to add a new equipment.</p>
    </div>

    <div v-else class="flex flex-col gap-4">
      <div 
        v-for="equip in equipments" 
        :key="equip.attr_id"
        class="bg-ott-bg-primary border border-ott-bg-dark rounded-xl p-5 hover:border-ott-accent transition-all group relative"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 bg-ott-bg-secondary rounded-lg">
            <Icon :icon="getIconForEquipment(equip)" width="24" class="text-ott-accent" />
          </div>
          <button 
            @click="store.deleteEquipment(equip.attr_id)"
            class="p-2 text-ott-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon icon="material-symbols:delete-outline" width="20" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ott-text-secondary mb-1">Name</label>
            <input 
              v-model="equip.Name"
              placeholder="Equipment Name"
              class="w-full bg-ott-bg-secondary border border-ott-bg-dark rounded px-3 py-2 focus:border-ott-accent outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ott-text-secondary mb-1">ID</label>
            <input 
              v-model="equip.attr_id"
              class="w-full bg-ott-bg-secondary border border-ott-bg-dark rounded px-3 py-2 text-sm opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ott-text-secondary mb-1">Description</label>
            <textarea 
              v-model="equip.Description"
              rows="2"
              placeholder="Further details..."
              class="w-full bg-ott-bg-secondary border border-ott-bg-dark rounded px-3 py-2 focus:border-ott-accent outline-none resize-none text-sm"
            ></textarea>
          </div>

          <div v-if="'Fixed' in equip" class="flex items-center gap-3">
            <input 
              type="checkbox" 
              v-model="equip.Fixed"
              :id="'fixed-' + equip.attr_id"
              class="w-4 h-4 rounded border-ott-bg-dark bg-ott-bg-secondary text-ott-accent focus:ring-ott-accent"
            />
            <label :for="'fixed-' + equip.attr_id" class="text-sm font-medium">Fixed at place</label>
          </div>

          <!-- Type specific fields -->
          <div v-if="equip instanceof AccessVehicleEquipment" class="grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2 bg-ott-bg-secondary p-2 rounded border border-ott-bg-dark">
              <input type="checkbox" v-model="equip.LowFloor" />
              <span class="text-xs">Low Floor</span>
            </div>
            <div class="flex items-center gap-2 bg-ott-bg-secondary p-2 rounded border border-ott-bg-dark">
              <input type="checkbox" v-model="equip.HighFloor" />
              <span class="text-xs">High Floor</span>
            </div>
            <div class="flex items-center gap-2 bg-ott-bg-secondary p-2 rounded border border-ott-bg-dark">
              <input type="checkbox" v-model="equip.Ramp" />
              <span class="text-xs">Ramp</span>
            </div>
          </div>

          <div v-if="equip instanceof ActualVehicleEquipment">
             <label class="block text-xs font-bold uppercase tracking-wider text-ott-text-secondary mb-1">Units</label>
             <input 
              type="number"
              v-model="equip.Units"
              class="w-full bg-ott-bg-secondary border border-ott-bg-dark rounded px-3 py-2 outline-none focus:border-ott-accent"
            />
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-ott-bg-dark flex justify-between items-center">
          <span class="text-[10px] font-bold uppercase text-ott-text-secondary/50">Type: {{ getEquipmentLabel(equip) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from '../store/editorstate';
import { storeToRefs } from 'pinia';
import { Icon } from '@iconify/vue';
import { AccessVehicleEquipment, SanitaryEquipment, SeatingEquipment } from '@/models/netex/passengerEquipment';
import { ActualVehicleEquipment } from '@/models/netex/actualVehicleEquipment';

const store = useEditorState();
const { equipments } = storeToRefs(store);

const equipmentTypes = [
  { name: 'Access', label: 'Access', class: AccessVehicleEquipment, icon: 'material-symbols:door-open-outline-rounded' },
  { name: 'Sanitary', label: 'Sanitary', class: SanitaryEquipment, icon: 'material-symbols:wc' },
  { name: 'Seating', label: 'Seating', class: SeatingEquipment, icon: 'material-symbols:airline-seat-recline-extra' },
];

function addNewEquipment(Cls: any) {
  const prefix = Cls.xmlTagName.toLowerCase().replace('equipment', '');
  const id = `${prefix}_${Date.now()}`;
  const newEquip = new Cls({
    attr_id: id,
    attr_version: '1.0',
    Name: `New ${Cls.xmlTagName}`
  });
  store.addEquipment(newEquip);
}

function getIconForEquipment(equip: any) {
  if (equip instanceof AccessVehicleEquipment) return 'material-symbols:door-open-outline-rounded';
  if (equip instanceof SanitaryEquipment) return 'material-symbols:wc';
  if (equip instanceof SeatingEquipment) return 'material-symbols:airline-seat-recline-extra';
  if (equip instanceof ActualVehicleEquipment) return 'material-symbols:settings-input-component';
  return 'material-symbols:construction';
}

function getEquipmentLabel(equip: any) {
  if (equip instanceof AccessVehicleEquipment) return 'Access';
  if (equip instanceof SanitaryEquipment) return 'Sanitary';
  if (equip instanceof SeatingEquipment) return 'Seating';
  if (equip instanceof ActualVehicleEquipment) return 'Actual';
  return 'Unknown';
}
</script>

<style scoped>
/* No additional scoped styles needed as we use global OTT classes and Tailwind utilities */
</style>

