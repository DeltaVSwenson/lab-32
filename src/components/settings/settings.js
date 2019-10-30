import React from 'react';

export const SettingsContext = React.createContext();

class SettingsProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfItems: 5,
      setNumber: this.setNumber,

      displayComplete: true,
      setDisplayComplete: this.setDisplayComplete
    }
  }

  setNumber = (value) => {
    this.setState({ numberOfItems : JSON.parse(value) });
  }

  setDisplayComplete = (bool) => {
    this.setState({ bool })
  }

  render() {
    return (
      <SettingsContext.Provider value={this.state}>
        {this.props.children}
      </SettingsContext.Provider>
    )
  }
}

export default SettingsProvider;
