'use strict';
import RxReact from 'rx-react';
import React from 'react';

import DoctorListItem from './DoctorListItemComponent';

class DoctorListComponent extends RxReact.Component {
  render() {
    return (
      <div>
        <ul id="results">
        {this.props.doctors.map(
          (result, index) =>
            <DoctorListItem key={index} doctor={result.profile}/>
          )
        }
        </ul>
      </div>
    );
  }
}

DoctorListComponent.displayName = 'SrcComponentsDoctorListComponent';

export default DoctorListComponent;
