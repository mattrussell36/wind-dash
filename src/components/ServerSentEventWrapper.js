import React, { Component } from 'react';

function serverSentEventWrapper(WrappedComponent) {
    return class extends Component {
        constructor() {
            super();

            this.state = {
                connectionOpen: false,
                message: null,
                error: null,
            };

            this.eventSource = null;

            this.handleOpen = this.handleOpen.bind(this);
            this.handleMessage = this.handleMessage.bind(this);
            this.handleError = this.handleError.bind(this);
        }

        initializeEventSource() {
            if (!window.EventSource) {
                return;
            }

            this.eventSource = new EventSource(this.props.url);
            this.eventSource.addEventListener('open', this.handleOpen, false);
            this.eventSource.addEventListener('message', this.handleMessage, false);
            this.eventSource.addEventListener('error', this.handleError, false);
        }
        
        handleOpen() {
            this.setState({ connectionOpen: true });
        }
        
        handleMessage(message) {
            this.setState({ message: message.data });
        }

        handleError(error) {
            this.setState({ error });
        }

        componentDidMount() {
            this.initializeEventSource();
        }

        componentWillUnmount() {
            this.eventSource.close();
        }

        render() {
            return <WrappedComponent {...this.props} message={this.state.message} />
        }
    }
}

export default serverSentEventWrapper;
