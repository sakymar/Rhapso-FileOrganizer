// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import { Sidebar as SidebarSemantic, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

type Props = {};

export default class Sidebar extends Component<Props> {
  props: Props;

  render() {
    return (
          <SidebarSemantic as={Menu} animation='overlay' width='thin' visible={true} icon='labeled' vertical inverted>
            <Link to={'/series'}>
              <Menu.Item name='television' as='a'>
                <Icon name='television' />
                TV Series
              </Menu.Item>
            </Link>
            
            <Menu.Item name='film' as='a'>
              <Icon name='film' />
              Movies
            </Menu.Item>
            <Menu.Item name='bar graph' as='a'>
              <Icon name='bar chart' />
              Stats
            </Menu.Item>
          </SidebarSemantic>
    );
  }
}
