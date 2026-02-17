import { Badge } from 'antd';

/* eslint-disable no-undef */
const dateCellRender = (value) => {
  const dayIndex = value.day();

  const matchedDay = Object.keys(groupedData).find((day) => dayMap[day] === dayIndex);

  if (!matchedDay) return null;

  const konselors = groupedData[matchedDay];

  return (
    <ul className="space-y-1">
      {konselors.map((konselor) => (
        <li key={konselor.id}>
          <Badge status={konselor.is_active ? 'success' : 'default'} text={konselor.user.name} />
        </li>
      ))}
    </ul>
  );
};
export default dateCellRender;
