import React, { useContext, useState } from 'react';
import 'antd/dist/antd.css';
import { Button, Col, DatePicker, Drawer, Form, Input, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createAuction } from "../api/apiCalls";
import { userContextMain } from "../App";
import moment from "moment";
import { UserContext, DrawerFormParam, DrawerFormDateValidator } from '../types/types';
import { Store } from 'antd/lib/form/interface';

export const DrawerForm = ({refresh}: DrawerFormParam): JSX.Element => {
    const [visible, setVisible] = useState<boolean>(false);

    const showDrawer = (): void => {
        setVisible(true);
    };

    const onClose = (): void => {
        setVisible(false);
    };

    const userContext = useContext<UserContext>(userContextMain);

    const onFinish = (values: Store): void => {
        createAuction({
            userId: userContext.userState.user.id,
            name: values.name,
            description: values.description,
            until: values.until.toISOString()
        }).then(refresh);
        form.resetFields();
        setVisible(false);
    }

    const [form] = Form.useForm();

    function disabledDate(current: moment.Moment): boolean {
        // Can not select days before today
        return current && current < moment().startOf('day');
    }

    return (
        <>
            <Button className="drawer-form-button" type="primary" onClick={showDrawer}>
                <PlusOutlined/> New offer
            </Button>
            <Drawer
                className="drawer-form"
                width={720}
                title="Create a new auction"
                onClose={onClose}
                visible={visible}
                footer={
                    <div className="drawer-form__buttons">
                        <Button className="drawer-form__buttons__cancel" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={form.submit} type="primary">
                            Submit
                        </Button>
                    </div>
                }
            >
                <Form className="drawer-form" form={form} onFinish={onFinish} layout="vertical" hideRequiredMark>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{required: true, message: 'Please enter auction name'}]}
                            >
                                <Input placeholder="Please enter auction name"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="until"
                                label="Ends at"
                                rules={[{required: true, message: 'Please choose the end of the auction'},
                                    (): DrawerFormDateValidator => ({
                                        validator(rule, value): Promise<void> {
                                            if (!value || value >= moment().add(1, 'minute')) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('The duration must be at least 1 minute');
                                        },
                                    })]}
                            >
                                <DatePicker showTime disabledDate={disabledDate}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter auction description',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} placeholder="Please enter auction description"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
}
