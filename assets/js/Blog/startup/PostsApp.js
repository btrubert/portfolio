import React from "react";
import Posts from "../containers/Posts";
import Post from "../containers/Post";
import { Route } from "react-router-dom";

const PostsApp = ({ initialProps, appContext }) => {
    return ( <
        div >
        <
        Route path = { "/post/:id" }
        render = {
            props => ( <
                Post {...initialProps }
                base = { appContext.base } {...props }
                />
            )
        }
        /> <
        Route path = { "/" }
        exact render = {
            props => ( <
                Posts {...initialProps }
                base = { appContext.base } {...props }
                />
            )
        }
        /> < /
        div >
    );
};

export default PostsApp;