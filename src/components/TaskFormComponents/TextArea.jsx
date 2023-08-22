import { useFormContext } from 'react-hook-form'

export const TextArea = ({ name, label, className }) => {
  const { register } = useFormContext()
  return (
    <>
      <label>{label}</label>
      <br />
      <textarea {...register(name)} className={className} />
      <br />
    </>
  )
}
