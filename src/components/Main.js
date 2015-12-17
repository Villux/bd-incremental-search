require('normalize.css');
require('styles/App.css');

import React from 'react';
import RxReact from 'rx-react';
import RxDom from 'rx-dom'
import DoctorList from './src/components/DoctorListComponent';



class AppComponent extends RxReact.Component {
  constructor(props) {
    super(props);
    // Init loading state
    this.state = {loading: false};

    // Create Observable for input field
    this.inputKeyup = RxReact.FuncSubject.create();
  }

  searchDoctor(name, skip) {
    // Clean for URI (remove spaces etc)
    let cleanName = global.encodeURIComponent(name);
    // Set state to loading, save search text for manual re-search
    this.setState({loading: true,
                   searchText: name});
    let url = `/api/v1/doctors?name=${cleanName}&skip=${skip}`;
    return RxDom.DOM.getJSON(url);
  }

  showMore() {
    if (this.state && this.state.searchText && !this.state.loading) {
      let skip = this.state.meta.skip + this.state.meta.limit;
      let doctorStream = this.searchDoctor(this.state.searchText, skip);
      let oldDoctorList = this.state.doctors;
      // Subscribe to AJAX observable
      // Update state when ready
      doctorStream.subscribe(
        results => this.setState(
          {doctors: oldDoctorList.concat(results.data),
           meta: results.meta,
           loading: false})
      );
    }
  }

  getStateStream() {
    // Fire event if no new action in 400ms
    // Filter out searches that include less than 3 characters
    // Filter out duplicates
    // Get doctors
    // Update state
    return (
      this.inputKeyup
      .map(e => e.target.value)
      .debounce(400)
      .filter(text => text.length > 2)
      .distinctUntilChanged()
      .flatMapLatest(text => this.searchDoctor(text, 0))
      .map(results => ({doctors: results.data,
                        meta: results.meta,
                        loading: false}))
    );
  }
  render() {
    var doctors = this.state && this.state.doctors || [];
    var loading = '';

    // Show spinner, if state loading
    if (this.state.loading) {
      loading = 'three-quarters-loader';
    }

    // Show button if more doctors available
    if (doctors.length > 0 && ((this.state.meta.total-this.state.meta.skip) > this.state.meta.limit)) {
      var getMoreButton =
        <div className="get-more-btn-container">
          <button className="get-more-btn btn-lg" onClick={this.showMore.bind(this)}>
            Show more doctors!
          </button>
          <div id="loading-spinner" className={loading} />
        </div>;
    }

    return (
      <div className="index">
        <div className="input-component">
          <input type="text" id="doctor-search" placeholder="Search for a doctor..." className="form-control" onKeyUp={this.inputKeyup}/>
          <div id="loading-spinner" className={loading} />
        </div>
        <div className="doctor-container">
          <DoctorList doctors={doctors} />
        </div>
        {getMoreButton}
      </div>
    );
  }
}

export default AppComponent;
