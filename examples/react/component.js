import React, { Component } from 'react';
import vpjs from 'viewportjs';

class MyComponent extends Component {

    constructor( props ) {

        super( props );

        this.state = {
            small: true, // set as default viewport
            medium: false,
            large: false
        }

        this.vps = vpjs( [
            {
                name: 'small',
                query: '( min-width:0px ) and ( max-width:480px )'
            },
            {
                name: 'medium',
                query: '( min-width:480px ) and ( max-width:767px )'
            },
            {
                name: 'large',
                query: '( min-width:769px )'
            }
        ] );
    }

    componentDidMount() {

        // Subscribe to all viewports
        this.vps( state => {

            // Update the state for all viewports
            this.setState( {
                small: this.vps.current( 'small' ),
                medium: this.vps.current( 'medium' ),
                large: this.vps.current( 'large' )
            } );
        } );

    }

    componentWillUnmount() {

        // Unsubscribe to all viewports
        this.vps.remove();

    }

    render() {

        return (

            { this.state.small &&
                <p>small viewport markup</p>
            }
            { this.state.medium &&
                <p>medium viewport markup</p>
            }
            { this.state.large &&
                <p>large viewport markup</p>
            }

        );
    }
}