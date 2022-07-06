<template>

<q-page padding>
  <q-form @submit="onSubmit" >
      <div class="col-lg-12 q-gutter-sm">
      <q-input
        outlined
        dense
        v-model="form.descricao"
        label="Descrição"
        :rules="[ val => val && val.length > 0 || 'Campo obrigatório']"
        class="row"

      />

     <q-select
        outlined
        dense
        v-model="form.tempoEstimado"
        label="Tempo estimado"
        :options="options"
        class="row"

      />

      <div class="row q-gutter-sm">
        <q-date v-model="form.dtMaxConclusao" mask="YYYY-MM-DD HH:mm:ss" color="primary" />
        <q-time v-model="form.dtMaxConclusao" mask="YYYY-MM-DD HH:mm:ss" color="primary" />
      </div>

      <div class="row q-gutter-sm">
        <q-btn label="Cancelar" color="white" text-color="primary" :to="{name:'home'}"/>
        <q-btn label="Salvar" color="primary" icon="save" type="submit"/>
      </div>

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
      dtMaxConclusao: '2012-07-01 00:00:00',
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
