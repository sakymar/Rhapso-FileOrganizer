import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/series';
import Dropzone from "react-dropzone";
import styles from './SeriesPage.css';
import { Button, Icon } from 'semantic-ui-react'

class SeriesPage extends Component{

    renderChildren({ isDragActive, isDragReject }) {
        if (isDragActive) {
          return <h2 className="drop-message">Omnomnom, let me have those videos!</h2>;
        } else if (isDragReject) {
          return <h2 className="drop-message">Uh oh, I don't know how to deal with that type of file!</h2>;
        } else {
          return <h2 className="drop-message">Drag and drop some files on me, or click to select.</h2>
        }
      }

    onDrop = (files) => {
    // invalid file types are not added to files object
    const videos = _.map(files, ({ name, path, size, type }) => {
        return { name, path, size, type };
    });

    if (videos.length) {
        this.props.addSerie(videos);
    }

    }

    componentDidMount(){
        console.log(this.props);
    }

    render(){
        return(
            <div style={{marginLeft:"10%"}} >
                <h1 style={{marginLeft:"25%", marginTop:"5%"}}> Organize TV Series</h1>
                <h3 style={{textAlign:"center"}}> Format</h3>
                <Dropzone
                    onDrop={this.onDrop}
                    multiple
                    accept="video/*"
                    className="dropzone"
                    activeClassName="dropzone-active"
                    rejectClassName="dropzone-reject"
                    
                >
                    {this.renderChildren}
                </Dropzone>
                <Button style={{marginLeft:"10%"}} icon color='red' labelPosition='right'>
                    Cancel
                    <Icon name='cancel' />
                </Button>
                <Button style={{marginLeft:"60%"}} icon  color='green' labelPosition='right'>
                    Confirm
                    <Icon name='right arrow' />
                </Button>
            </div>
            
        )
    }

}

function mapStateToProps(state) {
    return {
      series
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(actions, dispatch);
  }

export default connect(null, actions)(SeriesPage);