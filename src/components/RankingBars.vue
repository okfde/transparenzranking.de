<template>
  <table>
    <tr
      v-for="bar in state.performance"
      :key="bar.category"
      class="transition-all duration-700 ease-in-out"
    >
      <td
        class="text-sm text-gray-700 text-right md:whitespace-nowrap pr-4 flex min-h-8 items-center justify-end"
      >
        <span class="hidden md:inline">{{ bar.category }}</span>
      </td>
      <td class="w-full">
        <ranking-bar :color="bar.color" :progress="bar.points" />
      </td>
    </tr>
  </table>
</template>