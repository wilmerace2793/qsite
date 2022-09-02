<template>
  <div>
    <h2 class="text-primary tw-text-2xl tw-font-semibold tw-mb-4">
      Select a Report
    </h2>
    <div
      class="
        tw-flex
        tw-items-center
        tw-justify-end
        tw-bg-gray-100
        tw-rounded-xl
        tw-p-3
        tw-mb-3
      "
    >
      <div class="tw-hidden md:tw-block tw-border-r-2 tw-pr-4 tw-space-x-4">
        <q-btn flat rounded color="primary" no-caps class="tw-font-bold">
          <q-icon left size="1em" name="star" />
          <div>Add to Favourites</div>
        </q-btn>
        <q-btn outline rounded color="primary" no-caps class="tw-font-bold">
          <q-icon left size="1em" name="fa fa-plus" />
          <div>New Folder</div>
        </q-btn>
        <q-btn rounded color="negative" no-caps class="tw-font-bold">
          <q-icon left size="1em" name="fa fa-trash" />
          <div>Delete</div>
        </q-btn>
      </div>
      <q-btn
        outline
        rounded
        size="md"
        padding="xs"
        color="primary"
        icon="fas fa-ellipsis-v"
        class="btn-small md:tw-hidden tw-order-1 md:tw-order-0"
      >
        <q-menu>
          <q-list class="list-report-menu">
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="star" color="primary" />
              </q-item-section>

              <q-item-section>Add to Favourites</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="fa fa-plus" color="primary" />
              </q-item-section>

              <q-item-section>New Folder</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section avatar>
                <q-icon name="fa fa-trash" color="primary" />
              </q-item-section>

              <q-item-section>Delete</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <div class="tw-pl-0">
        <div class="tw-p-4 text-primary tw-order-0 md:tw-order-1">
          5 items selected
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>