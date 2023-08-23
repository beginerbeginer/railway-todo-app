import { useFormContext } from 'react-hook-form'

export const SelectList = ({ lists }) => {
  const { register } = useFormContext()
  return (
    <>
      <label>リスト</label>
      <br />
      <select {...register('selectListId')} className="new-task-select-list">
        {lists.map((list, key) => (
          <option key={key} className="list-item" value={list.id}>
            {list.title}
          </option>
        ))}
      </select>
      <br />
    </>
  )
}
