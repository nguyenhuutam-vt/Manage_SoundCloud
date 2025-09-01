import { useEffect } from "react";
import "../../styles/users.css";
import { useState } from "react";
import { Button, message, Popconfirm, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback } from "react";
// import CreateUserModal from "./create.user.modal";
// import UpdateUserModal from "./update.user.modal";

export interface ITracks {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
  uploader: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  isDeleted: boolean;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

const TracksTable = () => {
  const [listTracks, setListTracks] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<ITracks | null>(null);
  const access_token = localStorage.getItem("access_token") || "";
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  const columns: ColumnsType<ITracks> = [
    // ...columns definition as before
    {
      dataIndex: "_id",
      key: "_id",
      title: "STT",
      render: (value, record, index) => {
        return (
          <span>
            {(meta.current - 1 || 0) * (meta.pageSize || 0) + index + 1}
          </span>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, record) => {
        return <a>{record.title}</a>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Track url",
      dataIndex: "trackUrl",
      key: "trackUrl",
    },
    {
      title: "Uploader",
      dataIndex: "uploader",
      key: "uploader",
      render: (_, record) => {
        return <span>{record.uploader.name}</span>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Popconfirm
            title="Delete the task"
            description={`Are you sure to delete ${record.title}`}
            onConfirm={() => {
              deleteTrack(record._id!);
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

  // Cập nhật getTracks mỗi khi meta.current hoặc meta.pageSize thay đổi
  useEffect(() => {
    if (access_token) {
      getTracks();
    }
  }, [access_token, meta.current, meta.pageSize]);

  const deleteTrack = async (id: string) => {
    await fetch(`http://localhost:8000/api/v1/tracks/${id}`, {
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
          await getTracks();
          message.success("Delete user successfully");
        }
      });
  };

  const getTracks = useCallback(async () => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data1 = await res1.json();
    setListTracks(data1.data.result);
    console.log(data1.data.result);

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
          {/* 
          <CreateUserModal
            access_token={access_token}
            getTracks={getTracks}
            isCreateModalOpen={isCreateModalOpen}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />

          <UpdateUserModal
            access_token={access_token}
            getTracks={getTracks}
            isUpdateModalOpen={isUpdateModalOpen}
            setIsUpdateModalOpen={setIsUpdateModalOpen}
            dataUpdate={dataUpdate}
            // setDataUpdate={setDataUpdate}
          /> */}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={listTracks}
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
export default TracksTable;
