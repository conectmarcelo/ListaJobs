<template>
  <q-page padding>

    <q-form
      @submit.prevent="onSubmit"
      class="q-gutter-md"
    >
      <div class="row col-lg-12 q-gutter-sm justify-start">
        <P>Data Inicial:</P>
        <q-input outlined dense v-model="dtInicial" type="date"/>
        <p>Data Final:</p>
        <q-input outlined dense v-model="dtFinal" type="date"/>
        <q-btn label="Filtrar" @click="filtrar(dtInicial, dtFinal)" color="primary"></q-btn>
        <q-btn label="Listar todos" @click="getJobs()" color="positive"></q-btn>
      </div>
    </q-form>
    <p></p>

    <q-table
      title="Jobs"
      :rows="jobs"
      :columns="columns"
      row-key="name"
      :filter="filter"
      >

    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Pesquisar">
      <template v-slot:prepend >
        <q-icon name="search" />
      </template>
      <template v-slot:append >
        <q-btn color="primary" label="Adicionar" :to="{name:'formJobs'}"/>
      </template>
      </q-input>
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
    const $q = useQuasar()
    const router = useRouter()
    const columns = [
      { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
      { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
      {
        name: 'dtMaxConclusao',
        label: 'Data Máxima de conclusão',
        align: 'left',
        field: (row) => formataDataHora(row.dtMaxConclusao),
        sortable: true
      },
      { name: 'tempoEstimado', label: 'Tempo estimado', align: 'left', field: 'tempoEstimado', sortable: true },
      { name: 'actions', label: 'Ações', align: 'right', field: 'actions' }
    ]

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

    const formataDataHora = (dataHora) => {
      const data = dataHora.split(' ')[0].split('-').reverse().join('/')
      const hora = dataHora.split(' ')[1].replace(':00', '')

      return `${data} ${hora}`
    }

    const dtInicial = ref('')
    const dtFinal = ref('')

    const filtrar = async (dtInicial, dtFinal) => {
      console.log(dtInicial)
      console.log(dtFinal)

      const objetosFiltrados = jobs.value.filter(result => {
        return result.dtMaxConclusao >= `${dtInicial}` && result.dtMaxConclusao <= `${dtFinal}`
      })

      jobs.value = objetosFiltrados
    }

    return {
      jobs,
      columns,
      dtInicial,
      dtFinal,
      deleteJob,
      editjob,
      formataDataHora,
      filter: ref(''),
      selected: ref([]),
      filtrar,
      getJobs

    }
  }
})
</script>
