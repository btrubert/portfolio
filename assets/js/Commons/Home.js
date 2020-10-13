import React from 'react';
import {Jumbotron, Container} from 'react-bootstrap';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    // componentDidMount() {
    //      fetch('https://jsonplaceholder.typicode.com/posts/')
    //          .then(response => response.json())
    //          .then(entries => {
    //              this.setState({
    //                  entries
    //              });
    //          });
    // }

    render() {
        return (<>
            <Jumbotron fluid className="baniere">
            <p>Une baniere</p>
            </Jumbotron>
            <Container className="main-content">
            <h1>Welcome !</h1>
            </Container>
            </>
            );
    }
}

export default Home;

