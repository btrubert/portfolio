import React from "react";
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';
import Image from 'react-bootstrap/Image';

export default class Photos extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (this.props.photos) {
            this.state = {
                photos: this.props.photos,
                loading: false
            };
        } else {
            this.state = {
                photos: null,
                loading: true,
                cat: this.props.match.params.cat
            };
        }
    }

    componentDidMount() {
        if (this.state.loading) {
            fetch("/api/category/" + this.state.cat).then(response => {
                return response.json();
            }).then(data => {
                this.setState({photos: data, loading: false});
            });
        }
    }

    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        } else {
            return (
                <div> {
                this.state.photos.map(p => <Image src={"/build/images/"+p.path} roundedCircle />)
                } </div>
            );
        }
    }
}
