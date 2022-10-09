export default interface UserType {
  id: number
  first_name: string
  last_name: string
  date_of_birth: string
  email: string
  children_count: number
  picture?: string
  interest?: string[]
}