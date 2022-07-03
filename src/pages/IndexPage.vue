<template>
  <q-page padding>

    <q-table
      title="Treats"
      :rows="jobs"
      :columns="columns"
      row-key="name"
    />
  </q-page>
</template>

<script>

import { defineComponent, ref, onMounted } from 'vue'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const jobs = ref([])

    const columns = [
      { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
      { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
      { name: 'dtMaxConclusao', label: 'Data Máxima de conclusão', align: 'left', field: 'dtMaxConclusao', sortable: true },
      { name: 'tempoEstimado', label: 'Tempo estimado', align: 'left', field: 'tempoEstimado', sortable: true }
    ]

    onMounted(() => {
      getJobs()
    })

    const getJobs = async () => {
      try {
        const { data } = await api.get('jobs')
        jobs.value = data
      } catch (error) {

      }
    }

    return {
      jobs,
      columns
    }
  }
})
</script>
