import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, theme, Modal } from "antd";

import "./AdminLayout.css";
import { IS_LOGIN } from "../../constants";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logout = () => {
    Modal.confirm({
      title: "Do you want to exit ?",
      onOk: () => {
        navigate("/login");
        setIsLogin(false);
        localStorage.removeItem(IS_LOGIN);
      },
    });
  };

  return (
    <Layout>
      <Sider
        className="admin-aside"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className="admin-logo">{collapsed ? "LMS" : "LMS admin"}</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/teachers",
              icon: <VideoCameraOutlined />,
              label: <Link to="/teachers">Teachers</Link>,
            },
            {
              key: "/students",
              icon: <UploadOutlined />,
              label: <Link to="/students">Students</Link>,
            },
            {
              key: "4",
              icon: <UploadOutlined />,
              label: (
                <Button danger type="primary" onClick={logout}>
                  Logout
                </Button>
              ),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="admin-header"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          className="admin-main"
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

AdminLayout.propTypes = {
  setIsLogin: PropTypes.func,
};

export default AdminLayout;
