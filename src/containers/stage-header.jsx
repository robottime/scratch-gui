import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import VM from 'scratch-vm';
import {STAGE_SIZE_MODES} from '../lib/layout-constants';
import {setStageSize} from '../reducers/stage-size';
import {setFullScreen} from '../reducers/mode';

import {connect} from 'react-redux';

import StageHeaderComponent from '../components/stage-header/stage-header.jsx';

import ScratchBlocks from 'scratch-blocks';

// eslint-disable-next-line react/prefer-stateless-function
class StageHeader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleKeyPress'
        ]);
    }
    componentDidMount () {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    componentWillUnmount () {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress (event) {
        if (event.key === 'Escape' && this.props.isFullScreen) {
            this.props.onSetStageUnFull(false);
        }
    }
    render () {
        const {
            ...props
        } = this.props;
        return (
            <StageHeaderComponent
                {...props}
                onKeyPress={this.handleKeyPress}
            />
        );
    }
}

StageHeader.propTypes = {
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    onSetStageUnFull: PropTypes.func.isRequired,
    showBranding: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    showBranding: state.scratchGui.mode.showBranding,
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly
});

const mapDispatchToProps = dispatch => ({
    // onSetStageLarge: () => dispatch(setStageSize(STAGE_SIZE_MODES.large)),
    // onSetStageSmall: () => dispatch(setStageSize(STAGE_SIZE_MODES.small)),
    onOpenPythonEditor: function() {
        console.log('python');
    },
    onOpenArduinoEditor: function() {
        var arduinoCode = ScratchBlocks.Arduino.workspaceToCode(ScratchBlocks.getMainWorkspace())
        console.log(arduinoCode);
        const shell = require('electron').shell;
        const remote = require('electron').remote;
        const fs = remote.require('fs');
        const path = remote.require('path');
        const platform = remote.process.platform;
        var arduinoTempFile;
        if (platform == 'win32') {
            console.log('running on windows');
            var winPath = 'C:\\ProgramData\\ClickBlocks\\temp';
            if(!fs.existsSync(winPath)) {
                fs.mkdirSync('C:\\ProgramData\\ClickBlocks');
                fs.mkdirSync(winPath);
            }
            arduinoTempFile = path.join(winPath, 'temp.ino');
        }
        else {
            console.log('not running on windows');
            var linuxPath = '/tmp/temp';
            if(!fs.existsSync(linuxPath)) {
                fs.mkdirSync(linuxPath);
            }
            arduinoTempFile = path.join(linuxPath, 'temp.ino');
        }
        fs.writeFileSync(arduinoTempFile, arduinoCode);
        shell.openItem(arduinoTempFile);
    },
    onSetStageFull: () => dispatch(setFullScreen(true)),
    onSetStageUnFull: () => dispatch(setFullScreen(false))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StageHeader);
