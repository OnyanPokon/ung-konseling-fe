import { InputType } from '@/constants';
import { DatePicker, Form, Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import PropTypes from 'prop-types';

const FormItem = ({ formFields }) => {
  const renderFormInput = (item) => {
    switch (item.type) {
      case InputType.TEXT:
        return <Input placeholder={`Masukan ${item.label}`} size={item.size} readOnly={item.readOnly} {...item.extra} />;

      case InputType.NUMBER:
        return <InputNumber placeholder={`Masukan ${item.label}`} min={item.min} max={item.max} size={item.size} readOnly={item.readOnly} {...item.extra} />;

      case InputType.LONGTEXT:
        return <TextArea placeholder={item.label} rows={4} readOnly={item.readOnly} size={item.size} {...item.extra} />;
      case InputType.DATE:
        return <DatePicker size={item.size} placeholder={`Pilih ${item.label}`} readOnly={item.readOnly} {...item.extra} />;
      case InputType.SELECT:
        return <Select placeholder="Pilih" size={item.size} {...item} />;
    }
  };
  return (
    <>
      {formFields.map((item) => (
        <Form.Item key={item.name} label={item.label} name={item.name} className="m-0" rules={item.rules} dependencies={item.dependencies}>
          {renderFormInput(item)}
        </Form.Item>
      ))}
    </>
  );
};

FormItem.propTypes = {
  formFields: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default FormItem;
