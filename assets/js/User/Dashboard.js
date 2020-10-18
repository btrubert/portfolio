import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        return (<Container><h2>Dashboard</h2></Container>);
    }
}