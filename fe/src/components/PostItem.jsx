import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({ post }) => {
    const { _id, thumbnail, category, title, description, creator, createdAt } =
        post;

    return (
        <article className="post">
            <div className="post__thumbnail">
                <img
                    src={`${process.env.REACT_APP_ASSETS_URL}/${thumbnail}`}
                    alt={title}
                />
            </div>

            <div className="post__content">
                <Link to={`/posts/${_id}`}>
                    <h3>{title}</h3>
                </Link>
                <p dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>

            <div className="post__footer">
                <PostAuthor authorID={creator} createdAt={createdAt} />
                <Link
                    to={`/posts/categories/${category}`}
                    className="btn category"
                >
                    {category}
                </Link>
            </div>
        </article>
    );
};

export default PostItem;
