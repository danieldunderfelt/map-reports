import * as React from 'react'
import { Select, MenuItem } from '@material-ui/core'

export default ({ className = '', name = '', value, onChange, options }) => (
  <Select
    autoWidth={true}
    name={name}
    className={className}
    value={value}
    onChange={onChange}>
    {options.map(option => {
      const { value = option, label = option } = option

      return (
        <MenuItem value={value} key={`select_${name}_${value}`}>
          {label}
        </MenuItem>
      )
    })}
  </Select>
)
