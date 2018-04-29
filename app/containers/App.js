// @flow
import * as React from 'react';
import Sidebar from './Sidebar';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <Sidebar />
        {this.props.children}
      </div>
    );
  }
}
