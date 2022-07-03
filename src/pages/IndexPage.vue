<template>
  <q-page padding>

    <q-table
      title="Treats"
      :rows="jobs"
      :columns="columns"
      row-key="name"
    >
    <template v-slot:top>
      <span class="text-h5">Jobs</span>
      <q-space/>
      <q-btn color="primary" label="Adicionar" :to="{name:'formJobs'}"/>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props" class="q-gutter-sm">
        <q-btn icon="edit" color="info" dense size="md" @click="editjob(props.row.id)"/>
        <q-btn icon="delete" color="negative" dense size="md" @click="deleteJob(props.row.id)"/>
      </q-td>
    </template>
    </q-table>
  </q-page>
</template>

<script>

import { defineComponent, ref, onMounted } from 'vue'
import jobsService from 'src/services/jobs.js'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',

  setup () {
    const jobs = ref([])
    const { list, remove } = jobsService()

    const columns = [
      { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
      { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
      { name: 'dtMaxConclusao', label: 'Data Máxima de conclusão', align: 'left', field: 'dtMaxConclusao', sortable: true },
      { name: 'tempoEstimado', label: 'Tempo estimado', align: 'left', field: 'tempoEstimado', sortable: true },
      { name: 'actions', label: 'Ações', align: 'right', field: 'actions' }
    ]

    const $q = useQuasar()
    const router = useRouter()

    onMounted(() => {
      getJobs()
    })

    const getJobs = async () => {
      try {
        const { data } = await list()
        jobs.value = data
      } catch (error) {

      }
    }

    const deleteJob = async (id) => {
      try {
        $q.dialog({
          title: 'Remover',
          message: 'Deseja remover este job ?',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(id)
          $q.notify({ message: 'Apagado com sucesso!', icon: 'check', color: 'positive' })
          await getJobs()
        })
      } catch (error) {
        $q.notify({ message: 'Erro ao apagar', icon: 'times', color: 'positive' })
      }
    }

    const editjob = (id) => {
      router.push({ name: 'formJobs', params: { id } })
    }

    return {
      jobs,
      columns,
      deleteJob,
      editjob
    }
  }
})
</script>
