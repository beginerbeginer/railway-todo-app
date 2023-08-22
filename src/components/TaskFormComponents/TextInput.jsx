import { useFormContext } from 'react-hook-form'

export const TextInput = ({ name, label, className, type = 'text' }) => {
  const { register } = useFormContext()
  return (
    <>
      <label>{label}</label>
      <br />
      <input type={type} {...register(name)} className={className} />
      <br />
    </>
  )
}
