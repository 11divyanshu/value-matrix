import React from "react";
import { Device } from '@twilio/voice-sdk';
export default class DialerApp extends React.Component {
    constructor(){
      super();
      this.handleChangeCountryCode = this.handleChangeCountryCode.bind(this);
      this.handleChangeNumber = this.handleChangeNumber.bind(this);
      this.handleToggleMute = this.handleToggleMute.bind(this);
      this.handleToggleCall = this.handleToggleCall.bind(this);
      this.state = {
        muted: false,
        log: 'Connecting...',
        onPhone: false,
        currentNumber: '',
        isValidNumber: false,
        countries: [
          { name: 'India', cc: '91', code: 'in' },
          { name: 'United States', cc: '1', code: 'us' },
          { name: 'Great Britain', cc: '44', code: 'gb' },
          { name: 'Colombia', cc: '57', code: 'co' },
          { name: 'Ecuador', cc: '593', code: 'ec' },
          { name: 'Estonia', cc: '372', code: 'ee' },
          { name: 'Germany', cc: '49', code: 'de' },
          { name: 'Hong Kong', cc: '852', code: 'hk' },
          { name: 'Ireland', cc: '353', code: 'ie' },
          { name: 'Singapore', cc: '65', code: 'sg' },
          { name: 'Spain', cc: '34', code: 'es' },
          { name: 'Brazil', cc: '55', code: 'br' },
        ]      
      }
    }
    componentDidMount() {
      // console.log(Device);
      // $.getJSON('/token').done(function (data) {
      //   console.log(data);
      //   Device.setup(data.token);
      // }).fail(function (err) {
      //   console.log(err);
      //   this.setState({ log: 'Could not fetch token, see console.log' });
      // });
      // Device.disconnect(function () {
      //   this.setState({
      //     onPhone: false,
      //     log: 'Call ended.'
      //   });
      // });
      // Device.ready(function () {
      //   console.log("Twilio.Device Ready!");
      //   this.log = 'Connected';
      // });
    }
    handleChangeCountryCode(countryCode) {
      this.setState({ countryCode: countryCode });
    }
    handleChangeNumber(e) {
      this.setState({
        currentNumber: e.target.value,
        isValidNumber: /^([0-9]|#|\*)+$/.test(e.target.value.replace(/[-()\s]/g, ''))
      });
    }
    handleToggleMute() {
      var muted = !this.state.muted;
      this.setState({ muted: muted });
      Device.activeConnection().mute(muted);
    }
    handleToggleCall() {
      if (!this.state.onPhone) {
        // console.log("checked");
        this.setState({
          muted: false,
          onPhone: true
        })
        var n = '+91' + this.state.currentNumber.replace(/\D/g, '');
        Device.connect({ number: n });
        this.setState({ log: 'Calling ' + n })
      } else {
        Device.disconnectAll();
      }
    }
    render() {
      return (
        <div id="dialer">
          <div id="dial-form" className="input-group input-group-sm">
            <div className="input-group input-group-sm">
              <input type="tel" className="form-control" placeholder="555-666-7777"
                value={this.state.currentNumber} onChange={(e) => {
                  this.handleChangeNumber(e)
                }} />
            </div>
          </div>
          <div className="controls">
            <button className={'btn btn-circle btn-success ' + (this.state.onPhone ? 'btn-danger' : 'btn-success')}
              onClick={this.handleToggleCall} disabled={!this.state.isValidNumber} >
              <i className={'fa fa-fw fa-phone ' + (this.state.onPhone ? 'fa-close' : 'fa-phone')}></i>
            </button>
            {this.state.onPhone ? 
              <button className="btn btn-circle btn-default" onClick={this.handleToggleMute}>
                <i className={'fa fa-fw fa-microphone ' + (this.state.muted ? 'fa-microphone-slash' : 'fa-microphone')}></i>
              </button>
            : null}
          </div>
          <div>
            <div className="log">{this.state.text}</div>
            <p>{this.state.smallText}</p>
          </div>
        </div>
      );
    }
  }