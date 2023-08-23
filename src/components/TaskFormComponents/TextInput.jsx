import { useFormContext } from 'react-hook-form'

export const TextInput = ({ name, label, className, type = 'text' }) => {
  const { register } = useFormContext()
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <br />
      <input type={type} id={name} {...register(name)} className={className} />
      <br />
    </>
  )
}
