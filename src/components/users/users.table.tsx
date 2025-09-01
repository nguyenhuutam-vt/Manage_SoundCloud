import { useEffect } from "react";
import "../../styles/users.css";
import { useState } from "react";
import { Button, message, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback } from "react";
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";

export interface User {
  _id?: string;
  email: string;
  name: string;
  role: string;
  address?: string;
  age?: number;
  password?: string;
  gender?: string;
}

const UserTable = () => {
  const [listUser, setListUser] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<User | null>(null);
  const access_token = localStorage.getItem("access_token") || "";
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const columns: ColumnsType<User> = [
    // ...columns definition as before
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, record) => {
        return <a>{record.email}</a>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setIsUpdateModalOpen(true);
              setDataUpdate(record);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the task"
            description={`Are you sure to delete ${record.name}`}
            onConfirm={() => {
              deleteUser(record._id!);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // Cập nhật getData mỗi khi meta.current hoặc meta.pageSize thay đổi
  useEffect(() => {
    if (access_token) {
      getData();
    }
  }, [access_token, meta.current, meta.pageSize]);

  const deleteUser = async (id: string) => {
    await fetch(`http://localhost:8000/api/v1/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data?.data) {
          //reset form
          await getData();
          message.success("Delete user successfully");
        }
      });
  };

  const getData = useCallback(async () => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data1 = await res1.json();
    setListUser(data1.data.result);
    setMeta({
      current: data1.data.meta.current,
      pageSize: data1.data.meta.pageSize,
      pages: data1.data.meta.pages,
      total: data1.data.meta.total,
    });
  }, [access_token, meta.current, meta.pageSize]);

  const handleTableChange = (page: number, pageSize: number) => {
    setMeta((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Table</h2>
        <div>
          <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
            Add new
          </Button>
          <CreateUserModal
            access_token={access_token}
            getData={getData}
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />

          <UpdateUserModal
            access_token={access_token}
            getData={getData}
            isUpdateModalOpen={isUpdateModalOpen}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            dataUpdate={dataUpdate}
            // setDataUpdate={setDataUpdate}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={listUser}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) =>
            handleTableChange(page, pageSize),
          showSizeChanger: true,
        }}
      />
    </div>
  );
};
export default UserTable;
