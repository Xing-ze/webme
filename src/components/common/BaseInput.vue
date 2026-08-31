<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  type?: string
  disabled?: boolean
  label?: string
  hint?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="w-full">
    <label v-if="props.label" class="mb-1.5 block text-sm text-secondary">
      {{ props.label }}
    </label>
    <input
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      class="w-full rounded-xl2 border bg-surface-secondary px-4 py-2.5 text-primary transition-all duration-200 focus:outline-none focus:ring-2 ring-accent"
      :class="[
        props.error
          ? 'border-danger focus:border-danger'
          : 'border-default focus:border-accent',
        props.disabled ? 'opacity-60 cursor-not-allowed' : '',
      ]"
      @input="onInput"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
    <p v-if="props.error" class="mt-1 text-xs text-danger">
      {{ props.error }}
    </p>
    <p v-else-if="props.hint" class="mt-1 text-xs text-tertiary">
      {{ props.hint }}
    </p>
  </div>
</template>
