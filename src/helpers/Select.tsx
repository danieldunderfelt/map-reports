import * as React from 'react'
import { NativeSelect, MenuItem } from '@material-ui/core'
import styled from 'styled-components'

const SelectElement = styled(NativeSelect)`
  width: 100%;
`

export default ({ className = '', name = '', value, onChange, options }) => (
  <SelectElement
    name={name}
    className={className}
    value={value}
    onChange={onChange}>
    {options.map(option => {
      const { value = option, label = option } = option

      console.log(value)

      return (
        <option value={value} key={`select_${name}_${value}`}>
          {label}
        </option>
      )
    })}
  </SelectElement>
)
