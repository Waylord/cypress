import { observer } from 'mobx-react'
import React, { Component } from 'react'
import specsStore from './specs-store'

@observer
class SpecsList extends Component {
  specHierarchy (specs) {
    // group by first level
    const groups = {}

    specs.forEach((spec) => {
      // get the paths
      const pathArray = spec.name.split('/')

      if (pathArray.length) {
        const groupName = pathArray[0]

        const currentGroup = groups[groupName] || {}

        if (pathArray.length > 1) {
          currentGroup[pathArray[1]] = spec
        }

        groups[groupName] = currentGroup
      }
    })

    return groups
  }

  render () {
    const specGroups = this.specHierarchy(specsStore.specs)

    return (
      <div className="specs-list">
        <header>Select tests to run...</header>
        <ul>

          {Object.keys(specGroups).map((groupKey) => {
            const group = specGroups[groupKey]

            return (<li key={groupKey} >
              {groupKey}
              <ul>
                {Object.keys(group).map((spec) => this.specUnit(groupKey, group[spec], this.isActive(group[spec])))}
              </ul>
            </li>)
          })}

        </ul>
      </div>
    )
  }

  specUnit (path, spec, active) {
    return (<li key={spec.name} className={active ? 'specs-list-item__active' : null} onClick={this.chooseSpec(spec)}>
      {spec.name.replace(`${path}/`, '')}
    </li>)
  }

  chooseSpec (spec) {
    return () => {
      this.props.state.setSpec(spec)
    }
  }

  isActive (spec) {
    return spec.name === this.props.state.spec?.name
  }
}

export default SpecsList
