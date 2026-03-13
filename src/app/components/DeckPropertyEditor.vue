<template>
  <div class="bg-white flex flex-col gap-6 scrollbar-thin overflow-y-auto">
    <!-- Basic Properties -->
    <div class="grid grid-cols-2 gap-x-6 gap-y-4">
      <div class="flex flex-col gap-1.5">
        <label for="name" class="text-[11px] font-semibold text-ott-text-secondary uppercase tracking-wide">
          Name
        </label>
        <input
          type="text"
          id="name"
          :value="deck.Name"
          @input="(e) => handleUpdate('Name', (e.target as HTMLInputElement).value)"
          class="ott-input w-full bg-ott-bg-secondary border-transparent hover:border-ott-bg-dark focus:bg-white transition-all"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="width" class="text-[11px] font-semibold text-ott-text-secondary uppercase tracking-wide">
          Width (m)
        </label>
        <input
          type="number"
          id="width"
          :value="deck.Width"
          @input="(e) => handleUpdate('Width', parseFloat((e.target as HTMLInputElement).value))"
          class="ott-input w-full bg-ott-bg-secondary border-transparent hover:border-ott-bg-dark focus:bg-white transition-all"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="length" class="text-[11px] font-semibold text-ott-text-secondary uppercase tracking-wide">
          Length (m)
        </label>
        <input
          type="number"
          id="length"
          :value="deck.Length"
          @input="(e) => handleUpdate('Length', parseFloat((e.target as HTMLInputElement).value))"
          class="ott-input w-full bg-ott-bg-secondary border-transparent hover:border-ott-bg-dark focus:bg-white transition-all"
        />
      </div>
    </div>

    <div class="border-t border-ott-bg-dark pt-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-ott-text-primary tracking-wider">Spot Rows</h3>
        <button
          @click="addRow"
          class="text-base bg-ott-accent text-white px-2 py-1 rounded hover:bg-ott-accent/90 transition-colors flex items-center gap-1"
        >
          <Icon icon="material-symbols:add-rounded" width="14" />
          Add Row
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div v-for="(row, index) in deck.spotRows" :key="row.attr_id" class="flex items-center gap-2 bg-ott-bg-secondary/30 p-1.5 px-2 rounded border border-ott-bg-dark/50 group">
          <input
            :id="'row-' + index"
            type="text"
            :value="row.label"
            placeholder="Label"
            @input="(e) => updateRowLabel(index, (e.target as HTMLInputElement).value)"
            class="ott-input py-0.5 px-1.5 text-xs bg-white border-ott-bg-dark focus:border-ott-accent flex-1 min-w-0"
          />
          <button
            @click="deleteRow(index)"
            class="p-1 text-ott-text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Row"
          >
            <Icon icon="material-symbols:delete-outline-rounded" width="14" />
          </button>
        </div>
        <div v-if="deck.spotRows.length === 0" class="col-span-full text-[10px] text-ott-text-secondary italic text-center py-1">
          No rows defined
        </div>
      </div>
    </div>

    <div class="border-t border-ott-bg-dark pt-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-ott-text-primary tracking-wider">Spot Columns</h3>
        <button
          @click="addColumn"
          class="text-base bg-ott-accent text-white px-2 py-1 rounded hover:bg-ott-accent/90 transition-colors flex items-center gap-1"
        >
          <Icon icon="material-symbols:add-rounded" width="16" />
          Add Column
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div v-for="(col, index) in deck.spotColumns" :key="col.attr_id" class="flex items-center gap-2 bg-ott-bg-secondary/30 p-1.5 px-2 rounded border border-ott-bg-dark/50 group">
          <input
            :id="'col-' + index"
            type="text"
            :value="col.label"
            placeholder="Label"
            @input="(e) => updateColumnLabel(index, (e.target as HTMLInputElement).value)"
            class="ott-input py-0.5 px-1.5 text-xs bg-white border-ott-bg-dark focus:border-ott-accent flex-1 min-w-0"
          />
          <button
            @click="deleteColumn(index)"
            class="p-1 text-ott-text-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Column"
          >
            <Icon icon="material-symbols:delete-outline-rounded" width="14" />
          </button>
        </div>
        <div v-if="deck.spotColumns.length === 0" class="col-span-full text-[10px] text-ott-text-secondary italic text-center py-1">
          No columns defined
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Deck } from '@/models/netex/deckplan/deck/deck';
import { SpotRow } from '@/models/netex/deckplan/deck/spotRow';
import { SpotColumn } from '@/models/netex/deckplan/deck/spotColumn';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  deck: Deck;
}>();

const emit = defineEmits(['update']);

const handleUpdate = (key: string, value: any) => {
  emit('update', { [key]: value });
};

const addRow = () => {
  const newRow = new SpotRow({
    attr_id: `spot_row_${Date.now()}`,
    Label: (props.deck.spotRows.length + 1).toString()
  });
  const updatedRows = [...props.deck.spotRows, newRow];
  emit('update', { spotRows: updatedRows });
};

const updateRowLabel = (index: number, label: string) => {
  const row = props.deck.spotRows[index];
  if (!row) return;
  const updatedRows = [...props.deck.spotRows];
  updatedRows[index] = new SpotRow({
    attr_id: row.attr_id,
    Label: label
  });
  emit('update', { spotRows: updatedRows });
};

const deleteRow = (index: number) => {
  const updatedRows = props.deck.spotRows.filter((_, i) => i !== index);
  emit('update', { spotRows: updatedRows });
};

const addColumn = () => {
  const newCol = new SpotColumn({
    attr_id: `spot_column_${Date.now()}`,
    Label: (props.deck.spotColumns.length + 1).toString()
  });
  const updatedCols = [...props.deck.spotColumns, newCol];
  emit('update', { spotColumns: updatedCols });
};

const updateColumnLabel = (index: number, label: string) => {
  const col = props.deck.spotColumns[index];
  if (!col) return;
  const updatedCols = [...props.deck.spotColumns];
  updatedCols[index] = new SpotColumn({
    attr_id: col.attr_id,
    Label: label
  });
  emit('update', { spotColumns: updatedCols });
};

const deleteColumn = (index: number) => {
  const updatedCols = props.deck.spotColumns.filter((_, i) => i !== index);
  emit('update', { spotColumns: updatedCols });
};
</script>
