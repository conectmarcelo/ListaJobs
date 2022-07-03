import useApi from 'src/composables/UseApi'

export default function jobsService () {
  const { list, post, update, remove, getById } = useApi('jobs')

  return {
    list,
    post,
    update,
    remove,
    getById
  }
}
