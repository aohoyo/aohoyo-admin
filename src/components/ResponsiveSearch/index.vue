<template>
  <div class="responsive-search">
    <div class="search-area">
      <slot />
    </div>
    <div class="search-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.responsive-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.search-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .responsive-search {
    flex-direction: column;
    align-items: stretch;
  }

  .search-area {
    width: 100%;
  }
}
</style>
