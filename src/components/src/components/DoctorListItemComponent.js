'use strict';

import React from 'react';

class DoctorListItemComponent extends React.Component {
  render() {
    return (
      <li>
        <div className="media">
          <div className="media-left">
            <a href="#">
              <img className="media-object" src={this.props.doctor.image_url} />
            </a>
          </div>
          <div className="media-body">
            <h4 className="media-heading">{this.props.doctor.first_name} {this.props.doctor.middle_name} {this.props.doctor.last_name}</h4>
            {this.props.doctor.bio}
          </div>
        </div>
      </li>
    );
  }
}

DoctorListItemComponent.displayName = 'SrcComponentsDoctorListItemComponent';

export default DoctorListItemComponent;
