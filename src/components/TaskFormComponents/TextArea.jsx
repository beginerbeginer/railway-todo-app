import { useFormContext } from 'react-hook-form'

export const TextArea = ({ name, label, className }) => {
  const { register } = useFormContext()
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <br />
      <textarea id={name} {...register(name)} className={className} />
      <br />
    </>
  )
}
