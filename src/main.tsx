import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./App.scss";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import UserPage from "./screens/users.page.tsx";
import { ContactsOutlined, HomeOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { create } from "domain";
import TracksPage from "./screens/tracks.page.tsx";
import CommentTabs from "./components/comments/comment.tabls.tsx";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: <Link to="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link to="/users">Mange User</Link>,
    key: "mange-users",
    icon: <ContactsOutlined />,
  },

  {
    label: <Link to="/tracks">Mange Track</Link>,
    key: "mange-tracks",
    icon: <ContactsOutlined />,
  },

  {
    label: <Link to="/comments">Manage Comment</Link>,
    key: "manage-comments",
    icon: <ContactsOutlined />,
  },
];

const Header = () => {
  const [current, setCurrent] = useState("home");
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

const LayoutAdmin = () => {
  useEffect(() => {
    getLogin();
  }, []);

  const getLogin = async () => {
    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "hoidanit@gmail.com",
        password: "123456",
      }),
    });
    const data = await res.json();
    if (data && data.data) {
      localStorage.setItem("access_token", data.data.access_token);
    }
  };

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <App /> },
      {
        path: "/users",
        element: <UserPage />,
      },
      {
        path: "/tracks",
        element: <TracksPage />,
      },

      {
        path: "/comments",
        element: <CommentTabs />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
