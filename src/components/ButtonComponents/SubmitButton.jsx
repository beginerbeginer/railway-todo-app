export const SubmitButton = ({ text, className = '' }) => {
  return (
    <button type="submit" className={`${className}`}>
      {text}
    </button>
  )
}
