import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Form,
  Image,
  Modal,
  Space,
  Table,
  Input,
  Checkbox,
  Pagination,
} from "antd";
import request from "../server";
import { Link } from "react-router-dom";
import { LIMIT } from "../constants";

const TeachersPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      let params = {
        page: activePage,
        limit: LIMIT,
      };
      let { data } = await request.get("teacher", { params });
      let { data: totalData } = await request.get("teacher");

      setTotal(totalData.length);

      data = data.map((el) => {
        el.key = el.id;
        return el;
      });
      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [activePage]);

  useEffect(() => {
    getData();
  }, [getData]);

  const showModal = () => {
    form.resetFields();
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      setIsModalLoading(true);
      let values = await form.validateFields();
      if (selected === null) {
        await request.post("teacher", values);
      } else {
        await request.put(`teacher/${selected}`, values);
      }
      getData();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editTeacher = async (id) => {
    try {
      setIsModalOpen(true);
      setSelected(id);
      let { data } = await request.get(`teacher/${id}`);
      form.setFieldsValue(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTeacher = (id) => {
    Modal.confirm({
      title: "Do you want to delete this teacher ?",
      onOk: async () => {
        await request.delete(`teacher/${id}`);
        getData();
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "avatar",
      key: "avatar",
      render: (data) => <Image height={50} src={data} />,
    },
    {
      title: "Firstname",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Lastname",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Is married",
      dataIndex: "isMarried",
      key: "isMarried",
      render: (data) => (data ? "Yes" : "No"),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (data) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editTeacher(data)}>
            Edit
          </Button>
          <Button type="primary" danger onClick={() => deleteTeacher(data)}>
            Delete
          </Button>
          <Link to={`/teachers/${data}`} type="primary">
            See students
          </Link>
        </Space>
      ),
    },
  ];

  console.log(error);

  return (
    <Fragment>
      <Table
        scroll={{
          x: 1000,
        }}
        title={() => (
          <Flex justify="space-between" align="center">
            <h1>Teachers ({total})</h1>
            <Button type="dashed" onClick={showModal}>
              Add
            </Button>
          </Flex>
        )}
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={false}
      />
      <Pagination
        current={activePage}
        total={total}
        onChange={(page) => setActivePage(page)}
      />
      <Modal
        title="Teacher data"
        initialValues={{
          isMarried: false,
        }}
        maskClosable={false}
        confirmLoading={isModalLoading}
        okText={selected === null ? "Add teacher" : "Save teacher"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          name="teacher"
          autoComplete="off"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          form={form}
        >
          <Form.Item
            label="Firstname"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Lastname"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image"
            name="avatar"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="isMarried"
            valuePropName="checked"
            wrapperCol={{
              span: 24,
            }}
          >
            <Checkbox>Is married ?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default TeachersPage;
