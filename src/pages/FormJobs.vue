<template>

<q-page padding>
  <q-form @submit="onSubmit" class="row col-lg-12" >
    <div class="row col-lg-12 q-gutter-sm">
      <q-input
        outlined
        v-model="form.descricao"
        label="Descrição"
        :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
        class="col-lg-6 col-xs-12"
      />

     <q-select
        outlined
        v-model="form.tempoEstimado"
        label="Tempo estimado"
        :options="options"
        class="col-lg-5 col-xs-12"
      />
    </div>

    <span class="text-h6">Data máxima para conclusão:</span>
    <div class="q-gutter-md row col-lg-12 items-start">
      <q-date v-model="form.dtMaxConclusao" mask="YYYY-MM-DD HH:mm:ss" color="primary" />
      <q-time v-model="form.dtMaxConclusao" mask="YYYY-MM-DD HH:mm:ss" color="primary" />
    </div>

    <div class="float-right col-lg-6 q-gutter-sm q-mt-sm">
      <q-btn label="Salvar" color="primary" class="float-right" icon="save" type="submit"/>
      <q-btn label="Cancelar" color="white" text-color="primary" class="float-right" :to="{name:'home'}"/>

    </div>

      </q-form>
</q-page>

</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import jobsService from 'src/services/jobs'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'FormJobs',

  setup () {
    const { post, getById, update } = jobsService()
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const form = ref({
      id: '',
      descricao: '',
      dtMaxConclusao: '2019-02-22 21:02:00',
      tempoEstimado: ''

    })

    onMounted(async () => {
      if (route.params.id) {
        getJob(route.params.id)
      }
    })

    const getJob = async (id) => {
      try {
        const response = await getById(id)
        form.value = response
      } catch (error) {
        console.error(error)
      }
    }

    const onSubmit = async () => {
      try {
        if (form.value.id) {
          await update(form.value)
        } else {
          await post(form.value)
        }

        $q.notify({ message: 'Job salvo com sucesso!', icon: 'check', color: 'positive' })
        router.push({ name: 'home' })
      } catch (error) {
        console.error(error)
      }
    }

    const options = ref(['2 horas', '4 horas', '6 horas', '8 horas'])

    return {
      form,
      options,
      onSubmit,
      getJob

    }
  }

})
</script>
