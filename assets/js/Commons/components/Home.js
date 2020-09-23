import React from 'react';


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
        return (
            <h1>Welcome !</h1>
            );
    }
}

export default Home;

