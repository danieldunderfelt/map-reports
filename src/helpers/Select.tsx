import * as React from 'react'

export default ({ className = '', name = '', value, onChange, options }) => (
  <select name={name} className={className} value={value} onChange={onChange}>
    {options.map(option => {
      const { value = option, label = option } = option

      return (
        <option value={value} key={`select_${name}_${value}`}>
          {label}
        </option>
      )
    })}
  </select>
)
