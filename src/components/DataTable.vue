<template>
  <div>
    <table v-if="validData.length" class="table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">
            {{ col }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in validData" :key="index">
          <td v-for="col in columns" :key="col">
            {{ row[col] }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty">
      No hay datos para mostrar
    </div>
  </div>
</template>

<script>
export default {
  name: "DynamicTable",

  props: {
    data: {
      type: Array,
      required: true
    }
  },

  data() {
    return {}
  },

  computed: {
    validData() {
      if (Array.isArray(this.data) && this.data.length > 0) {
        return this.data
      }
      return []
    },

    columns() {
      if (this.validData.length > 0) {
        return Object.keys(this.validData[0])
      }
      return []
    }
  },

  methods: {}
}
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ccc;
  padding: 6px 10px;
  text-align: left;
  font-size: 14px;
}

.empty {
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
