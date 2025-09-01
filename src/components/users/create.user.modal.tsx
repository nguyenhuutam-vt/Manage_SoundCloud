import {
  Checkbox,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from "antd";
import { Option } from "antd/es/mentions";

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

const CreateUserModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;
  const [form] = Form.useForm();

  const onFinish: FormProps["onFinish"] = async (values) => {
    const res1 = await fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values }),
    });
    const d = await res1.json();
    if (d?.data) {
      //reset form
      await getData();
      notification.success({
        message: "Success",
        description: "User added successfully",
        placement: "topRight",
      });
      handleClose();
    } else {
      notification.error({
        message: "Error",
        description: d.message || "Failed to add user",
        placement: "topRight",
      });
    }
    form.resetFields();
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Add New User"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleClose()}
      maskClosable={false}
    >
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[
            {
              required: true,
              type: "number",
              min: 0,
              max: 99,
              message: "Please input your age!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select placeholder="select your role">
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
            <Option value="guest">Guest</Option>
          </Select>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
