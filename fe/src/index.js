import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import Authors from "./pages/Authors";
import CreatePost from "./pages/CreatePost";
import CategoryPosts from "./pages/CategoryPosts";
import LogoutPage from "./pages/LogoutPage";
import AuthorsPosts from "./pages/AuthorPosts";
import Dashboard from "./pages/Dashboard";
import EditPosts from "./pages/EditPosts";
import DeletePost from "./pages/DeletePost";
import UserProvider from "./context/userContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: <UserProvider><Layout /></UserProvider>,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "posts/:id",
                element: <PostDetails />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "logout",
                element: <LogoutPage />
            },
            {
                path: "profile/:id",
                element: <UserProfile />
            },
            {
                path: "authors",
                element: <Authors />
            },
            {
                path: "create",
                element: <CreatePost />
            },
            {
                path: "posts/categories/:category",
                element: <CategoryPosts />
            },
            {
                path: "posts/users/:id",
                element: <AuthorsPosts />
            },
            {
                path: "myposts/:id",
                element: <Dashboard />
            },
            {
                path: "posts/:id/edit",
                element: <EditPosts />
            },
            {
                path: "posts/:id/delete",
                element: <DeletePost />
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
