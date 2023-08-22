export const RadioButton = ({ text, id, name, value, ...rest }) => {
  return (
    <label>
      <input type="radio" id={id} name={name} value={value} {...rest} />
      {text}
    </label>
  )
}
